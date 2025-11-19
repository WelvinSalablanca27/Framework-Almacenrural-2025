<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import TablaVenta from '../components/Venta/TablaVenta';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroVenta from '../components/Venta/ModalRegistroVenta';
import ModalEdicionVenta from '../components/Venta/ModalEdicionVenta';
import ModalEliminacionVenta from '../components/Venta/ModalEliminacionVenta';
import ModalDetallesVenta from "../components/DetallesVenta/detalle_venta";
const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

=======
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
>>>>>>> 105cc7943bed06b79d8aa5a98550f08473c88b9d
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);
<<<<<<< HEAD

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const hoy = new Date().toISOString().split("T")[0];

  const [nuevaVenta, setNuevaVenta] = useState({
    id_Cliente: "",
    Fe_Venta: hoy,
    total_venta: 0,
  });

  const [ventaEnEdicion, setVentaEnEdicion] = useState(null);
  const [detallesNuevos, setDetallesNuevos] = useState([]);
=======
  const [ventaEnEdicion, setVentaEnEdicion] = useState(null);
  const [detallesNuevos, setDetallesNuevos] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const hoy = new Date().toISOString().split("T")[0];
  const [nuevaVenta, setNuevaVenta] = useState({ id_Cliente: "", Fe_Venta: hoy });

  // ======================= Cargar datos =======================
  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      setCargando(true);
      const [resVentas, resClientes, resProductos, resDetalles] = await Promise.all([
        fetch("http://localhost:3001/api/Venta"),
        fetch("http://localhost:3001/api/Cliente"),
        fetch("http://localhost:3001/api/Producto"),
        fetch("http://localhost:3001/api/Detalles_venta"),
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
      alert("Error al cargar datos.");
      setCargando(false);
    }
  };

  // ======================= Búsqueda =======================
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

  // ======================= Agregar Venta =======================
  const agregarVenta = async () => {
    if (!nuevaVenta.id_Cliente || detallesNuevos.length === 0) {
      alert("Completa cliente y agrega al menos un producto.");
      return;
    }

    try {
      const ventaResp = await fetch("http://localhost:3001/api/registrarVenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaVenta),
      });

      if (!ventaResp.ok) throw new Error("Error al crear venta");

      const created = await ventaResp.json();
      const id_ventas = created.id_ventas || created.insertId || created.id;

      for (const d of detallesNuevos) {
        await fetch("http://localhost:3001/api/registrarDetalleVenta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_Venta: id_ventas,
            id_Producto: d.id_Producto,
            Precio_venta: d.Precio_venta,
            Cantidad_Producto: d.Cantidad_Producto,
          }),
        });
      }

      await obtenerDatos();
      setMostrarModalRegistro(false);
      setNuevaVenta({ id_Cliente: "", Fe_Venta: hoy });
      setDetallesNuevos([]);
    } catch (error) {
      console.error(error);
      alert("Error al registrar venta.");
    }
  };

  // ======================= Editar Venta =======================
  const abrirModalEdicion = (venta) => {
    setVentaAEditar(venta);
    setVentaEnEdicion({
      id_ventas: venta.id_ventas,
      id_Cliente: venta.id_Cliente,
      Fe_Venta: venta.Fe_Venta ? venta.Fe_Venta.split("T")[0] : hoy,
    });

    setDetallesNuevos(
      (venta.detalles || []).map((d) => ({
        id_DetalleVenta: d.id_DetalleVenta || d.id,
        id_Producto: d.id_Producto,
        nombre_producto: d.nombre_producto,
        Cantidad_Producto: d.Cantidad_Producto,
        Precio_venta: d.Precio_venta,
      }))
    );

    setMostrarModalEdicion(true);
  };

  const actualizarVenta = async () => {
    try {
      if (!ventaEnEdicion.id_Cliente || detallesNuevos.length === 0) {
        alert("Completa cliente y agrega al menos un producto.");
        return;
      }

      // Actualizar cabecera
      await fetch(`http://localhost:3001/api/actualizarVenta/${ventaAEditar.id_ventas}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ventaEnEdicion),
      });

      // Eliminar detalles antiguos
      const respDetalles = await fetch("http://localhost:3001/api/detallesventas");
      const todos = await respDetalles.json();
      const actuales = todos.filter((d) => d.id_Venta === ventaAEditar.id_ventas);

      for (const d of actuales) {
        await fetch(`http://localhost:3001/api/eliminarDetalleVenta/${d.id_DetalleVenta || d.id}`, {
          method: "DELETE",
        });
      }

      // Agregar detalles nuevos
      for (const d of detallesNuevos) {
        await fetch("http://localhost:3001/api/registrarDetalleVenta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_Venta: ventaAEditar.id_ventas,
            id_Producto: d.id_Producto,
            Cantidad_Producto: d.Cantidad_Producto,
            Precio_venta: d.Precio_venta,
          }),
        });
      }

      await obtenerDatos();
      setMostrarModalEdicion(false);
      setVentaAEditar(null);
      setVentaEnEdicion(null);
      setDetallesNuevos([]);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar venta.");
    }
  };

  // ======================= Eliminar Venta =======================
  const confirmarEliminacion = async () => {
    try {
      await fetch(`http://localhost:3001/api/eliminarVenta/${ventaAEliminar.id_ventas}`, {
        method: "DELETE",
      });

      setVentas((prev) => prev.filter((v) => v.id_ventas !== ventaAEliminar.id_ventas));
      setVentasFiltradas((prev) => prev.filter((v) => v.id_ventas !== ventaAEliminar.id_ventas));
      setMostrarModalEliminar(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar.");
    }
  };

  // ======================= Ver detalles =======================
  const verDetalles = (id_ventas) => {
    const venta = ventas.find((v) => v.id_ventas === id_ventas);
    setDetallesVenta(venta ? venta.detalles : []);
    setMostrarModalDetalles(true);
  };
>>>>>>> 105cc7943bed06b79d8aa5a98550f08473c88b9d

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

<<<<<<< HEAD
  // ------------------ FETCH DE DATOS ------------------
  const obtenerVentas = async () => {
    try {
      const resp = await fetch("http://localhost:3001/api/venta");
      const datos = await resp.json();

      // Obtener nombre del cliente
      const ventasConCliente = await Promise.all(
        datos.map(async (v) => {
          const clienteResp = await fetch(
            `http://localhost:3001/api/clientes/${v.id_Cliente}`
          );
          const cliente = await clienteResp.json();
          return {
            ...v,
            nombre_cliente: cliente
              ? `${cliente.primer_nombre} ${cliente.primer_apellido}`
              : "N/A",
          };
        })
      );

      setVentas(ventasConCliente);
      setVentasFiltradas(ventasConCliente);
      setCargando(false);
    } catch (error) {
      console.error(error);
      setCargando(false);
      alert("Error al cargar ventas.");
    }
  };

  const obtenerClientes = async () => {
    try {
      const resp = await fetch("http://localhost:3001/api/clientes");
      const datos = await resp.json();
      setClientes(datos);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerProductos = async () => {
    try {
      const resp = await fetch("http://localhost:3001/api/productos");
      const datos = await resp.json();
      setProductos(datos);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerDetallesVenta = async (id_venta) => {
    try {
      const resp = await fetch("http://localhost:3001/api/detalles_ventas");
      const datos = await resp.json();
      const filtrados = datos.filter((d) => d.id_Venta === id_venta);

      const detallesConNombre = await Promise.all(
        filtrados.map(async (d) => {
          const prodResp = await fetch(
            `http://localhost:3001/api/producto/${d.id_Producto}`
          );
          const prod = await prodResp.json();
          return {
            ...d,
            nombre_producto: prod.nombre_producto || "N/A",
          };
        })
      );

      setDetallesVenta(detallesConNombre);
      setMostrarModalDetalles(true);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los detalles.");
    }
  };

  // ------------------ BÚSQUEDA ------------------
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = ventas.filter(
      (v) =>
        v.id_ventas.toString().includes(texto) ||
        (v.nombre_cliente && v.nombre_cliente.toLowerCase().includes(texto))
    );
    setVentasFiltradas(filtrados);
    setPaginaActual(1);
  };

  // ------------------ REGISTRO DE VENTA ------------------
  const agregarVenta = async () => {
    if (!nuevaVenta.id_Cliente || detallesNuevos.length === 0) {
      alert("Selecciona un cliente y agrega al menos un producto.");
      return;
    }

    const total = detallesNuevos.reduce(
      (sum, d) => sum + d.Cantidad_Producto * d.Precio_venta,
      0
    );

    try {
      const ventaResp = await fetch("http://localhost:3001/api/registrarventa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nuevaVenta, total_venta: total }),
      });

      const { id_ventas } = await ventaResp.json();

      for (const d of detallesNuevos) {
        await fetch("http://localhost:3001/api/registrarDetalleVenta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...d, id_Venta: id_ventas }),
        });
      }

      await obtenerVentas();
      cerrarModalRegistro();
    } catch (error) {
      console.error(error);
      alert("Error al registrar venta.");
    }
  };

  // ------------------ MODAL EDICIÓN ------------------
  const abrirModalEdicionVenta = async (venta) => {
    setVentaAEditar(venta);

    setVentaEnEdicion({
      id_Cliente: venta.id_Cliente,
      Fe_Venta: new Date(venta.Fe_Venta).toISOString().split("T")[0],
    });

    const resp = await fetch("http://localhost:3001/api/detalles_ventas");
    const datos = await resp.json();
    const detalles = datos.filter((d) => d.id_Venta === venta.id_ventas);

    const detallesConNombre = await Promise.all(
      detalles.map(async (d) => {
        const prodResp = await fetch(
          `http://localhost:3001/api/producto/${d.id_Producto}`
        );
        const prod = await prodResp.json();
        return {
          ...d,
          nombre_producto: prod.nombre_producto || "N/A",
        };
      })
    );

    setDetallesNuevos(detallesConNombre);
    setMostrarModalEdicion(true);
  };

  const actualizarVenta = async () => {
    const total = detallesNuevos.reduce(
      (sum, d) => sum + d.Cantidad_Producto * d.Precio_venta,
      0
    );

    try {
      await fetch(`http://localhost:3001/api/actualizarventa/${ventaAEditar.id_ventas}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ventaEnEdicion, total_venta: total }),
      });

      // Borrar detalles anteriores
      const resp = await fetch("http://localhost:3001/api/detalles_ventas");
      const datos = await resp.json();
      const actuales = datos.filter((d) => d.id_Venta === ventaAEditar.id_ventas);
      for (const d of actuales) {
        await fetch(`http://localhost:3001/api/eliminarDetalleVenta/${d.id_DetalleVenta}`, {
          method: "DELETE",
        });
      }

      // Registrar nuevos detalles
      for (const d of detallesNuevos) {
        await fetch("http://localhost:3001/api/registrarDetalleVenta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...d, id_Venta: ventaAEditar.id_ventas }),
        });
      }

      await obtenerVentas();
      cerrarModalEdicion();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar venta.");
    }
  };

  // ------------------ ELIMINAR ------------------
  const abrirModalEliminarVenta = (venta) => {
    setVentaAEliminar(venta);
    setMostrarModalEliminar(true);
  };

  const eliminarVenta = async () => {
    try {
      await fetch(`http://localhost:3001/api/eliminarventa/${ventaAEliminar.id_ventas}`, {
        method: "DELETE",
      });
      await obtenerVentas();
      setMostrarModalEliminar(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la venta.");
    }
  };

  // ------------------ CERRAR MODALES ------------------
  const cerrarModalRegistro = () => {
    setMostrarModalRegistro(false);
    setNuevaVenta({ id_Cliente: "", Fe_Venta: hoy, total_venta: 0 });
    setDetallesNuevos([]);
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
    setVentaAEditar(null);
    setVentaEnEdicion(null);
    setDetallesNuevos([]);
  };

  // ------------------ EFFECT ------------------
  useEffect(() => {
    obtenerVentas();
    obtenerClientes();
    obtenerProductos();
  }, []);

  // ------------------ RENDER ------------------
  return (
    <Container className="mt-4">
      <h4>Ventas</h4>
      <Row>
        <Col lg={5} md={6} sm={8} xs={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button className="color-boton-registro" onClick={() => setMostrarModalRegistro(true)}>
            + Nueva Venta
          </Button>
        </Col>
      </Row>

      <TablaVenta
        ventas={ventasPaginadas}
        cargando={cargando}
        obtenerDetalles={obtenerDetallesVenta}
        abrirModalEdicion={abrirModalEdicionVenta}
        abrirModalEliminacion={abrirModalEliminarVenta}
        totalElementos={ventasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />

      <ModalRegistroVenta
        mostrar={mostrarModalRegistro}
        setMostrar={cerrarModalRegistro}
        nuevaVenta={nuevaVenta}
        setNuevaVenta={setNuevaVenta}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        clientes={clientes}
        productos={productos}
        agregarVenta={agregarVenta}
        hoy={hoy}
      />

      <ModalEdicionVenta
        mostrar={mostrarModalEdicion}
        setMostrar={cerrarModalEdicion}
        venta={ventaAEditar}
        ventaEnEdicion={ventaEnEdicion}
        setVentaEnEdicion={setVentaEnEdicion}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        clientes={clientes}
        productos={productos}
        actualizarVenta={actualizarVenta}
      />

      <ModalEliminacionVenta
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        venta={ventaAEliminar}
        confirmarEliminacion={eliminarVenta}
      />

      <ModalDetallesVenta
        mostrarModal={mostrarModalDetalles}
        setMostrarModal={() => setMostrarModalDetalles(false)}
        detalles={detallesVenta}
      />
    </Container>
=======
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
          <h2 className="text-center text-primary fw-bold mb-4">Gestión de Ventas</h2>

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

          <ModalRegistroVenta
            mostrar={mostrarModalRegistro}
            setMostrar={setMostrarModalRegistro}
            nuevaVenta={nuevaVenta}
            setNuevaVenta={setNuevaVenta}
            detalles={detallesNuevos}
            setDetalles={setDetallesNuevos}
            clientes={clientes}
            productos={productos}
            onGuardarVenta={agregarVenta}
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
            actualizarVenta={actualizarVenta}
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
>>>>>>> 105cc7943bed06b79d8aa5a98550f08473c88b9d
  );
};

export default Ventas;
