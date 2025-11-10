import { useEffect, useState } from "react";
import { Container, Col, Row, Button } from 'react-bootstrap';
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaUsuario from "../components/Usuarios/TablaUsuario";
import ModalRegistroUsuario from "../components/Usuarios/ModalRegistroUsuario";
import ModalEdicionUsuario from "../components/Usuarios/ModalEdicionUsuario";
import ModalEliminacionUsuario from "../components/Usuarios/ModalEliminarUsuario";


// FONDO COMPLETO: BODEGA DE FERRETERÍA (SIN BORDES, SIN RALLAS)
const fondoFerreteria = "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";



const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargado, setCargado] = useState(true);

  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo_electronico: "",
    contrasena: "",
    telefono: "",
    genero: "",
    rol: ""
  });

  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 13;

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [usuarioEditado, setUsuarioEditado] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditado({ ...usuario });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3001/api/actualizarUsuarioPatch/${usuarioEditado.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioEditado)
      });
      if (!respuesta.ok) throw new Error('Error al actualizar');
      setMostrarModalEdicion(false);
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al editar usuario:", error);
      alert("No se pudo actualizar el usuario.");
    }
  };

  const abrirModalEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3001/api/eliminarUsuario/${usuarioAEliminar.id}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) throw new Error('Error al eliminar');
      setMostrarModalEliminar(false);
      setUsuarioAEliminar(null);
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo eliminar el usuario.");
    }
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const agregarUsuario = async () => {
    if (!nuevoUsuario.nombre.trim()) return;

    try {
      const respuesta = await fetch("http://localhost:3001/api/registrarUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!respuesta.ok) throw new Error("Error al guardar");

      setNuevoUsuario({
        nombre: "",
        apellido: "",
        correo_electronico: "",
        contrasena: "",
        telefono: "",
        genero: "",
        rol: ""
      });
      setMostrarModal(false);
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      alert("No se pudo guardar el usuario.");
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch("http://localhost:3001/api/usuarios");
      if (!respuesta.ok) throw new Error("Error al obtener los usuarios");
      const datos = await respuesta.json();
      setUsuarios(datos);
      setUsuariosFiltrados(datos);
      setCargado(false);
    } catch (error) {
      console.log(error.message);
      setCargado(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = usuarios.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(texto) ||
        usuario.id.toString().includes(texto)
    );
    setUsuariosFiltrados(filtrados);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Usuarios</h4>
      <Row>
        <Col lg={5} md={6} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button className="color-boton-registro" onClick={() => setMostrarModal(true)}>
            + Nuevo Usuario
          </Button>
        </Col>
      </Row>

      <TablaUsuario
        usuarios={usuariosPaginados}
        cargado={cargado}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={usuarios.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroUsuario
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoUsuario={nuevoUsuario}
        manejarCambioInput={manejarCambioInput}
        agregarUsuario={agregarUsuario}
      />

      <ModalEdicionUsuario
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        usuarioEditado={usuarioEditado}
        setUsuarioEditado={setUsuarioEditado}
        guardarEdicion={guardarEdicion}
      />

      <ModalEliminacionUsuario
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        usuario={usuarioAEliminar}
        confirmarEliminacion={confirmarEliminacion}
      />
    </Container>
  );
};

export default Usuario;
