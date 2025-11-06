import { useEffect, useState } from "react";
import { Container, Col, Row, Button } from 'react-bootstrap';
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaProductos from "../components/Producto/TablaProducto";
import ModalRegistroProducto from "../components/Producto/ModalRegistroProducto";
import ModalEdicionProducto from "../components/Producto/MOdalEdicionProducto";
import ModalEliminacionProducto from "../components/Producto/ModalEliminacionProducto";

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    Nombre_Prod: "",
    Tipo_Prod: "",
    Existencia_Prod: "",
    Precio_Costo: "",
    Precio_Venta: "",
    Fe_caducidad: ""
  });

  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 13;

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [productoEditado, setProductoEditado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const abrirModalEdicion = (producto) => {
    setProductoEditado({ ...producto });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!productoEditado.Nombre_Prod.trim()) return;
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarProductoPatch/${productoEditado.id_Producto}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoEditado)
      });
      if (!respuesta.ok) throw new Error('Error al actualizar');
      setMostrarModalEdicion(false);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al editar producto:", error);
      alert("No se pudo actualizar el producto.");
    }
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarProducto/${productoAEliminar.id_Producto}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) throw new Error('Error al eliminar');
      setMostrarModalEliminar(false);
      setProductoAEliminar(null);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.Nombre_Prod.trim()) return;

    try {
      const respuesta = await fetch("http://localhost:3000/api/registrarProducto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error("Error al guardar");

      setNuevoProducto({
        Nombre_Prod: "",
        Tipo_Prod: "",
        Existencia_Prod: "",
        Precio_Costo: "",
        Precio_Venta: "",
        Fe_caducidad: ""
      });
      setMostrarModal(false);
      await obtenerProductos();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("No se pudo guardar el producto.");
    }
  };

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/productos");
      if (!respuesta.ok) throw new Error("Error al obtener los productos");
      const datos = await respuesta.json();
      setProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.log(error.message);
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = productos.filter(
      (producto) =>
        producto.Nombre_Prod.toLowerCase().includes(texto) ||
        producto.id_Producto.toString().includes(texto)
    );
    setProductosFiltrados(filtrados);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Productos</h4>
      <Row>
        <Col lg={5} md={6} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button className="color-boton-registro" onClick={() => setMostrarModal(true)}>
            + Nuevo Producto
          </Button>
        </Col>
      </Row>

      <TablaProductos
        productos={productosPaginados}
        cargando={cargando}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={productos.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejarCambioInput={manejarCambioInput}
        agregarProducto={agregarProducto}
      />

      <ModalEdicionProducto
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        productoEditado={productoEditado}
        setProductoEditado={setProductoEditado}
        guardarEdicion={guardarEdicion}
      />

      <ModalEliminacionProducto
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        producto={productoAEliminar}
        confirmarEliminacion={confirmarEliminacion}
      />
    </Container>
  );
};

export default Producto;
