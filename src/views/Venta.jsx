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

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);

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

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

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
  );
};

export default Ventas;
