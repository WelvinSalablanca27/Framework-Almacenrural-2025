import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaVentas from "../components/Venta/TablaVenta";
import ModalRegistroVenta from "../components/Venta/ModalRegistroVenta";
import ModalEdicionVenta from "../components/Venta/ModalEdicionVenta";
import ModalEliminacionVenta from "../components/Venta/ModalEliminacionVenta";
import ModalDetallesVenta from "../components/DetallesVenta/detalle_venta";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const fondoalmacenrural =
  "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Venta = () => {
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);
  const [ventaEnEdicion, setVentaEnEdicion] = useState(null);
  const [detallesNuevos, setDetallesNuevos] = useState([]);
  const [detallesVenta, setDetallesVenta] = useState([]);

  const hoy = new Date().toISOString().split("T")[0];

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      setCargando(true);
      const [resVentas, resClientes, resProductos, resDetalles] = await Promise.all([
        fetch("http://localhost:3001/api/Venta"),
        fetch("http://localhost:3001/api/clientes"),
        fetch("http://localhost:3001/api/producto"),
        fetch("http://localhost:3001/api/detallesventas"),
      ]);

      const ventasRaw = await resVentas.json();
      const clientesRaw = await resClientes.json();
      const productosRaw = await resProductos.json();
      const detallesRaw = await resDetalles.json();

      const mapaClientes = {};
      clientesRaw.forEach((c) => (mapaClientes[c.id_Cliente] = c.Nombre_Cliente));

      const mapaProductos = {};
      productosRaw.forEach((p) => (mapaProductos[p.id_Producto] = p.Nombre_Producto));

      const ventasEnriquecidas = ventasRaw.map((v) => {
        const detalles = detallesRaw
          .filter((d) => d.id_Venta === v.id_ventas)
          .map((d) => ({
            ...d,
            nombre_producto: mapaProductos[d.id_Producto] || "Producto eliminado",
            Cantidad_Producto: d.Cantidad_Producto || d.Cantidad || 0,
            Precio_venta: d.Precio_venta || d.Precio || 0,
          }));

        const totalProductos = detalles.reduce((t, d) => t + d.Cantidad_Producto, 0);
        const totalMonto = detalles.reduce((t, d) => t + d.Cantidad_Producto * d.Precio_venta, 0);

        return {
          ...v,
          nombre_cliente: mapaClientes[v.id_Cliente] || "Cliente eliminado",
          detalles,
          totalProductos,
          totalMonto,
          fechaBonita: v.Fe_Venta ? new Date(v.Fe_Venta).toLocaleDateString("es-MX") : "—",
        };
      });

      setClientes(clientesRaw);
      setProductos(productosRaw);
      setVentas(ventasEnriquecidas);
      setVentasFiltradas(ventasEnriquecidas);
      setCargando(false);
    } catch (error) {
      console.error(error);
      setCargando(false);
    }
  };

  // Buscador
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtradas = ventas.filter(
      (v) =>
        v.id_ventas.toString().includes(texto) ||
        (v.nombre_cliente && v.nombre_cliente.toLowerCase().includes(texto)) ||
        (v.fechaBonita && v.fechaBonita.includes(texto))
    );

    setVentasFiltradas(filtradas);
    setPaginaActual(1);
  };

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // PDF
  const generarPDFVentas = () => {
    const doc = new jsPDF();
    doc.text("REPORTE DE VENTAS", 105, 20, { align: "center" });

    const tabla = ventasFiltradas.map((v) => [
      v.id_ventas,
      v.nombre_cliente,
      v.fechaBonita,
      v.totalProductos,
      "C$ " + v.totalMonto.toFixed(2),
    ]);

    doc.autoTable({
      head: [["ID", "Cliente", "Fecha", "Productos", "Total"]],
      body: tabla,
      startY: 30,
      theme: "grid",
    });

    doc.save(`Ventas_${hoy}.pdf`);
  };

  // Excel
  const exportarExcelVentas = () => {
    const datos = [];
    ventas.forEach((v) => {
      if (!v.detalles || v.detalles.length === 0) {
        datos.push({
          "ID Venta": v.id_ventas,
          Cliente: v.nombre_cliente,
          Fecha: v.fechaBonita,
          Total: v.totalMonto.toFixed(2),
        });
      } else {
        v.detalles.forEach((d) => {
          datos.push({
            "ID Venta": v.id_ventas,
            Cliente: v.nombre_cliente,
            Fecha: v.fechaBonita,
            Producto: d.nombre_producto,
            Cantidad: d.Cantidad_Producto,
            Precio: d.Precio_venta,
            Subtotal: (d.Cantidad_Producto * d.Precio_venta).toFixed(2),
          });
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    const excel = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([excel]), `Ventas_${hoy}.xlsx`);
  };

  // Render
  return (
    <div
      style={{
        backgroundImage: `url(${fondoalmacenrural})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100vw",
        padding: 0,
        margin: 0,
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "auto",
      }}
    >
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", padding: "70px" }}
      >
        <div
          className="position-relative p-4 rounded-4 shadow-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.75)",
            maxWidth: "1200px",
            width: "100%",
            border: "3px solid #198754",
            borderRadius: "20px",
            backdropFilter: "blur(8px)",
          }}
        >
          <h4 className="text-center mb-4 fw-bold text-success">Gestión de Ventas</h4>

          {/* Buscador y botones */}
          <Row className="mb-3 align-items-center mt-3">
            <Col lg={7} md={8} sm={12} className="mb-2 mb-md-0">
              <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                manejarCambioBusqueda={manejarCambioBusqueda}
              />
            </Col>
            <Col className="text-end d-flex justify-content-end flex-wrap gap-2">
              <Button
                variant="success"
                className="fw-bold px-4 shadow-sm"
                onClick={() => setMostrarModalRegistro(true)}
              >
                + Venta
              </Button>
              <Button
                variant="primary"
                className="fw-bold px-4 shadow-sm"
                onClick={generarPDFVentas}
              >
                PDF
              </Button>
              <Button
                variant="success"
                className="fw-bold px-4 shadow-sm"
                onClick={exportarExcelVentas}
              >
                Excel
              </Button>
            </Col>
          </Row>

          {/* Tabla con scroll */}
          <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "8px" }}>
            <TablaVentas
              ventas={ventasPaginadas}
              cargando={cargando}
              obtenerDetalles={(id) => {
                const venta = ventas.find((v) => v.id_ventas === id);
                setDetallesVenta(venta ? venta.detalles : []);
                setMostrarModalDetalles(true);
              }}
              abrirModalEdicion={(v) => {
                setVentaAEditar(v);
                setVentaEnEdicion({
                  id_ventas: v.id_ventas,
                  id_Cliente: v.id_Cliente,
                  Fe_Venta: v.Fe_Venta ? v.Fe_Venta.split("T")[0] : hoy,
                });
                setDetallesNuevos(v.detalles || []);
                setMostrarModalEdicion(true);
              }}
              abrirModalEliminacion={(v) => {
                setVentaAEliminar(v);
                setMostrarModalEliminar(true);
              }}
              totalElementos={ventasFiltradas.length}
              elementosPorPagina={elementosPorPagina}
              paginaActual={paginaActual}
              establecerPaginaActual={setPaginaActual}
            />
          </div>

          {/* Modales */}
          <ModalRegistroVenta
            mostrar={mostrarModalRegistro}
            setMostrar={setMostrarModalRegistro}
            clientes={clientes}
            productos={productos}
            onGuardarVenta={() => {}}
            hoy={hoy}
          />
          <ModalEdicionVenta
            mostrar={mostrarModalEdicion}
            setMostrar={setMostrarModalEdicion}
            venta={ventaAEditar}
            ventaEnEdicion={ventaEnEdicion}
            setVentaEnEdicion={setVentaEnEdicion}
            detalles={detallesNuevos}
            setDetalles={setDetallesNuevos}
            clientes={clientes}
            productos={productos}
            actualizarVenta={() => {}}
          />
          <ModalEliminacionVenta
            mostrar={mostrarModalEliminar}
            setMostrar={setMostrarModalEliminar}
            venta={ventaAEliminar}
            confirmarEliminacion={() => {}}
          />
          <ModalDetallesVenta
            mostrarModal={mostrarModalDetalles}
            setMostrarModal={setMostrarModalDetalles}
            detalles={detallesVenta}
          />
        </div>
      </Container>
    </div>
  );
};

export default Venta;
