import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaUsuario from "../components/Usuarios/TablaUsuario";
import ModalRegistroUsuario from "../components/Usuarios/ModalRegistroUsuario";
import ModalEdicionUsuario from "../components/Usuarios/ModalEdicionUsuario";
import ModalEliminacionUsuario from "../components/Usuarios/ModalEliminarUsuario";

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

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [usuarioEditado, setUsuarioEditado] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 13;

  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch("http://localhost:3001/api/Usuarios");
      if (!respuesta.ok) throw new Error("Error al obtener los usuarios");
      const datos = await respuesta.json();
      setUsuarios(datos);
      setUsuariosFiltrados(datos);
      setCargado(false);
    } catch (error) {
      console.error(error);
      setCargado(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = usuarios.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(texto) ||
        usuario.id.toString().includes(texto)
    );
    setUsuariosFiltrados(filtrados);
    establecerPaginaActual(1);
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
      console.error();
      alert("No se pudo guardar el usuario.");
    }
  };

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditado({ ...usuario });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3001/api/actualizarUsuario/${usuarioEditado.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioEditado)
      });
      if (!respuesta.ok) throw new Error('Error al actualizar');
      setMostrarModalEdicion(false);
      await obtenerUsuarios();
    } catch (error) {
      console.error(error);
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
      console.error(error);
      alert("No se pudo eliminar el usuario.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${fondoFerreteria})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "auto"
      }}
    >
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", padding: "70px" }}>
        <div
          className="position-relative p-4 rounded-4 shadow-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            width: "100%",
            maxWidth: "1200px",
            border: "3px solid #198754",
            borderRadius: "20px",
            backdropFilter: "blur(8px)",
          }}
        >
          <h4 className="text-center fw-bold text-success mb-4">Gestión de Usuarios</h4>

          {/* Buscador y Botón */}
          <Row className="mb-3 align-items-center">
            <Col lg={5} md={6} sm={12} className="mb-2 mb-md-0">
              <CuadroBusquedas textoBusqueda={textoBusqueda} manejarCambioBusqueda={manejarCambioBusqueda} />
            </Col>
            <Col className="text-end">
              <Button className="fw-bold px-4 shadow-sm" variant="success" onClick={() => setMostrarModal(true)}>+ Nuevo Usuario</Button>
            </Col>
          </Row>

          {/* Tabla con scroll */}
          <div style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: "8px" }}>
            <TablaUsuario
              usuarios={usuariosPaginados}
              cargado={cargado}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
              totalElementos={usuariosFiltrados.length}
              elementosPorPagina={elementosPorPagina}
              paginaActual={paginaActual}
              establecerPaginaActual={establecerPaginaActual}
            />
          </div>

          {/* Modales */}
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
        </div>
      </Container>
    </div>
  );
};

export default Usuario;
