// ======================= VENTA.jsx =======================
// ============== Versión moderna, limpia y mejorada ==============

import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

import TablaVentas from "../components/Venta/TablaVenta";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

import ModalRegistroVenta from "../components/Venta/ModalRegistrarVenta";
import ModalEdicionVenta from "../components/Venta/ModalEdicionVenta";
import ModalEliminacionVenta from "../components/Venta/ModalEliminacionVenta";
import ModalDetallesVenta from "../components/detalle_venta/ModalDetallesVenta";

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

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);

  const [ventaEnEdicion, setVentaEnEdicion] = useState(null);
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const hoy = new Date().toISOString().split("T")[0];

  const [nuevaVenta, setNuevaVenta] = useState({
    id_Cliente: "",
    Fe_Venta: hoy,
  });

  // ======================= Cargar datos =======================
  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      setCargando(true);

      const [resVentas, resClientes, resProductos, resDetalles] =
        await Promise.all([
          fetch("http://localhost:3000/api/ventas"),
          fetch("http://localhost:3000/api/clientes"),
          fetch("http://localhost:3000/api/producto"),
          fetch("http://localhost:3000/api/detallesventas"),
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
          .filter((d) => d.id_ventas === v.id_ventas)
          .map((d) => ({
            ...d,
            nombre_producto: mapaProductos[d.id_Producto] || "Producto eliminado",
          }));

        const totalProductos = detalles.reduce((t, d) => t + d.Cantidad_Producto, 0);
        const totalMonto = detalles.reduce(
          (t, d) => t + d.Cantidad_Producto * d.Precio_venta,
          0
        );

        return {
          ...v,
          nombre_cliente: mapaClientes[v.id_Cliente] || "Cliente eliminado",
          detalles,
          totalProductos,
          totalMonto,
          fechaBonita: new Date(v.Fe_Venta).toLocaleDateString("es-MX"),
        };
      });

      setClientes(clientesRaw);
      setProductos(productosRaw);
      setVentas(ventasEnriquecidas);
      setVentasFiltradas(ventasEnriquecidas);
      setCargando(false);
    } catch (error) {
      console.error(error);
      alert("Error al cargar datos.");
    }
  };

  // ======================= Busqueda =======================
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtradas = ventas.filter(
      (v) =>
        v.id_ventas.toString().includes(texto) ||
        v.nombre_cliente.toLowerCase().includes(texto) ||
        v.fechaBonita.includes(texto)
    );

    setVentasFiltradas(filtradas);
    setPaginaActual(1);
  };

  // ======================= PDF =======================
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

  // ======================= Excel =======================
  const exportarExcelVentas = () => {
    const datos = [];

    ventas.forEach((v) => {
      if (v.detalles.length === 0) {
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

  // ======================= Edición =======================
  const abrirModalEdicion = (venta) => {
    setVentaAEditar(venta);

    setVentaEnEdicion({
      id_Cliente: venta.id_Cliente,
      Fe_Venta: venta.Fe_Venta.split("T")[0],
    });

    setDetallesNuevos(
      venta.detalles.map((d) => ({
        id_Producto: d.id_Producto,
        nombre_producto: d.nombre_producto,
        Cantidad_Producto: d.Cantidad_Producto,
        Precio_venta: d.Precio_venta,
      }))
    );

    setMostrarModalEdicion(true);
  };

  const actualizarVentaEditada = (ventaActualizada) => {
    const mapaClientes = {};
    clientes.forEach((c) => (mapaClientes[c.id_Cliente] = c.Nombre_Cliente));

    const ventaConNombre = {
      ...ventaActualizada,
      nombre_cliente: mapaClientes[ventaActualizada.id_Cliente],
      fechaBonita: new Date(ventaActualizada.Fe_Venta).toLocaleDateString("es-MX"),
    };

    setVentas((prev) =>
      prev.map((v) => (v.id_ventas === ventaActualizada.id_ventas ? ventaConNombre : v))
    );

    setVentasFiltradas((prev) =>
      prev.map((v) =>
        v.id_ventas === ventaActualizada.id_ventas ? ventaConNombre : v
      )
    );
  };

  // ======================= Eliminar =======================
  const confirmarEliminacion = async () => {
    try {
      await fetch(
        `http://localhost:3000/api/eliminarVenta/${ventaAEliminar.id_ventas}`,
        { method: "DELETE" }
      );

      setVentas((prev) =>
        prev.filter((v) => v.id_ventas !== ventaAEliminar.id_ventas)
      );

      setVentasFiltradas((prev) =>
        prev.filter((v) => v.id_ventas !== ventaAEliminar.id_ventas)
      );

      setMostrarModalEliminar(false);
    } catch (error) {
      alert("No se pudo eliminar.");
    }
  };

  // ======================= Detalles =======================
  const verDetalles = (id_ventas) => {
    const venta = ventas.find((v) => v.id_ventas === id_ventas);
    setDetallesVenta(venta.detalles);
    setMostrarModalDetalles(true);
  };

  // ======================= Render =======================
  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <div
      style={{
        backgroundImage: `url(${fondoalmacenrural})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        paddingTop: "40px",
      }}
    >
      <Container style={{ maxWidth: "1100px" }}>
        <Card className="p-4 rounded-4 shadow-lg">
          <h2 className="text-center text-primary fw-bold mb-4">
            Gestión de Ventas
          </h2>

          {/* BUSQUEDA + ACCIONES */}
          <Row className="mb-4 align-items-center">
            <Col md={7}>
              <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                manejarCambioBusqueda={manejarCambioBusqueda}
              />
            </Col>

            <Col className="text-end">
              <Button
                variant="success"
                className="me-2"
                onClick={() => setMostrarModalRegistro(true)}
              >
                + Venta
              </Button>

              <Button variant="danger" className="me-2" onClick={generarPDFVentas}>
                PDF
              </Button>

              <Button variant="info" onClick={exportarExcelVentas}>
                Excel
              </Button>
            </Col>
          </Row>

          {/* TABLA */}
          <TablaVentas
            ventas={ventasPaginadas}
            cargando={cargando}
            obtenerDetalles={verDetalles}
            abrirModalEdicion={abrirModalEdicion}
            abrirModalEliminacion={(v) => {
              setVentaAEliminar(v);
              setMostrarModalEliminar(true);
            }}
            totalElementos={ventasFiltradas.length}
            elementosPorPagina={elementosPorPagina}
            paginaActual={paginaActual}
            establecerPaginaActual={setPaginaActual}
          />

          {/* MODALES */}
          <ModalRegistroVenta
            mostrar={mostrarModalRegistro}
            setMostrar={setMostrarModalRegistro}
            nuevaVenta={nuevaVenta}
            setNuevaVenta={setNuevaVenta}
            detalles={detallesNuevos}
            setDetalles={setDetallesNuevos}
            clientes={clientes}
            productos={productos}
            onSuccess={obtenerDatos}
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
            onSuccess={(ventaActualizada) => {
              actualizarVentaEditada(ventaActualizada);
              setMostrarModalEdicion(false);
            }}
          />

          <ModalEliminacionVenta
            mostrar={mostrarModalEliminar}
            setMostrar={setMostrarModalEliminar}
            venta={ventaAEliminar}
            confirmarEliminacion={confirmarEliminacion}
          />

          <ModalDetallesVenta
            mostrarModal={mostrarModalDetalles}
            setMostrarModal={setMostrarModalDetalles}
            detalles={detallesVenta}
          />
        </Card>
      </Container>
    </div>
  );
};

export default Venta;
