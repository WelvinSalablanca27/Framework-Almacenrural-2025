import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaVentas from "../components/Venta/TablaVenta";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroVenta from "../components/Venta/ModalRegistrarVenta";
import ModalEdicionVenta from "../components/Venta/ModalEdicionVenta";
import ModalEliminacionVenta from "../components/Venta/ModalEliminacionVenta";
import ModalDetallesVenta from "../components/detalle_venta/ModalDetallesVenta";

const Venta = () => {
  const hoy = new Date().toISOString().split("T")[0];

  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);

  const [nuevaVenta, setNuevaVenta] = useState({
    id_cliente: "",
    Fe_venta: hoy,
  });
  const [ventaEnEdicion, setVentaEnEdicion] = useState(null);

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const obtenerVentas = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/obtenerVentas");
      if (!resp.ok) throw new Error("Error al obtener ventas");
      const datos = await resp.json();
      setVentas(datos);
      setVentasFiltradas(datos);
    } catch (error) {
      console.error(error.message);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = ({ target: { value } }) => {
    const texto = value.toLowerCase();
    setTextoBusqueda(texto);
    setVentasFiltradas(
      ventas.filter(
        (v) =>
          v.id_cliente.toString().includes(texto) ||
          v.Fe_venta.toLowerCase().includes(texto)
      )
    );
    setPaginaActual(1);
  };

  const manejarCambioInput = ({ target: { name, value } }) =>
    setNuevaVenta((prev) => ({ ...prev, [name]: value }));

  const agregarVenta = async () => {
    if (!nuevaVenta.id_cliente.trim() || !nuevaVenta.Fe_venta.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    try {
      const resp = await fetch("http://localhost:3000/api/registrarVenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaVenta),
      });
      if (!resp.ok) throw new Error("Error al registrar venta");
      setNuevaVenta({ id_cliente: "", Fe_venta: hoy });
      setMostrarModalRegistro(false);
      await obtenerVentas();
    } catch (error) {
      console.error(error);
      alert("Error al agregar la venta.");
    }
  };

  const abrirModalEdicion = (venta) => {
    setVentaAEditar(venta);
    setVentaEnEdicion({
      id_cliente: venta.id_cliente,
      Fe_venta: venta.Fe_venta,
    });
    setMostrarModalEdicion(true);
  };

  const actualizarVenta = async () => {
    try {
      await fetch(
        `http://localhost:3000/api/actualizarVenta/${ventaAEditar.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ventaEnEdicion),
        }
      );
      cerrarModalEdicion();
      await obtenerVentas();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la venta.");
    }
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
    setVentaAEditar(null);
    setVentaEnEdicion(null);
  };

  const abrirModalEliminacion = (venta) => {
    setVentaAEliminar(venta);
    setMostrarModalEliminar(true);
  };

  const eliminarVenta = async () => {
    try {
      await fetch(
        `http://localhost:3000/api/eliminarVenta/${ventaAEliminar.id}`,
        {
          method: "DELETE",
        }
      );
      setMostrarModalEliminar(false);
      await obtenerVentas();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la venta.");
    }
  };

    const obtenerClientes = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/obtenerClientes");
      if (!resp.ok) throw new Error("Error al obtener clientes");
      const datos = await resp.json();
      return datos;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  };

  const obtenerDetallesVenta = async (id) => {
    try {
      const resp = await fetch(
        `http://localhost:3000/api/detallesVentas/${id}`
      );
      if (!resp.ok) throw new Error("Error al obtener detalles");
      const datos = await resp.json();
      setDetallesVenta(datos);
      setMostrarModalDetalles(true);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los detalles.");
    }
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Venta</h4>
      <Row className="align-items-center mb-3">
        <Col lg={5} md={6} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => setMostrarModalRegistro(true)}
          >
            + Nueva Venta
          </Button>
        </Col>
      </Row>

      <TablaVentas
        ventas={ventasPaginadas}
        cargando={cargando}
        obtenerDetalles={obtenerDetallesVenta}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={ventasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />

      <ModalRegistroVenta
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaVenta={nuevaVenta}
        manejarCambioInput={manejarCambioInput}
        agregarVenta={agregarVenta}
      />

      <ModalEdicionVenta
        mostrarModal={mostrarModalEdicion}
        setMostrarModal={cerrarModalEdicion}
        venta={ventaAEditar}
        ventaEnEdicion={ventaEnEdicion}
        setVentaEnEdicion={setVentaEnEdicion}
        actualizarVenta={actualizarVenta}
      />

      <ModalEliminacionVenta
        mostrarModal={mostrarModalEliminar}
        setMostrarModal={setMostrarModalEliminar}
        venta={ventaAEliminar}
        confirmarEliminacion={eliminarVenta}
      />

      <ModalDetallesVenta
        mostrarModal={mostrarModalDetalles}
        setMostrarModal={() => setMostrarModalDetalles(false)}
        detalles={detallesVenta}
      />
    </Container>
  );
};

export default Venta;
