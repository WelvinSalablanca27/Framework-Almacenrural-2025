import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaUsuario from "../components/Usuarios/TablaUsuario";
import ModalRegistroUsuario from "../components/Usuarios/ModalRegistroUsuario";
import ModalEdicionUsuario from "../components/Usuarios/ModalEdicionUsuario";
import ModalEliminacionUsuario from "../components/Usuarios/ModalEliminarUsuario";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const fondoalmacenrural =
  "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo_electronico: "",
    contrasena: "",
    telefono: "",
    genero: "",
    rol: "",
  });

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [usuarioEditado, setUsuarioEditado] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  // Detecta si es escritorio
  const esEscritorio = useMediaQuery({ minWidth: 992 });

  // -----------------------------
  // Fetch
  // -----------------------------
  const obtenerUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/Usuarios");
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const datos = await res.json();
      setUsuarios(datos);
      setUsuariosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error(error);
      setCargando(false);
    }
  };

  useEffect(() => {
    if (mostrarTabla) obtenerUsuarios();
  }, [mostrarTabla]);

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = usuarios.filter(
      (u) =>
        u.nombre.toLowerCase().includes(texto) ||
        u.apellido.toLowerCase().includes(texto) ||
        u.correo_electronico.toLowerCase().includes(texto) ||
        u.rol.toLowerCase().includes(texto)
    );
    setUsuariosFiltrados(filtrados);
    setPaginaActual(1);
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const agregarUsuario = async () => {
    if (!nuevoUsuario.nombre.trim()) return;
    try {
      const res = await fetch("http://localhost:3001/api/registrarusuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });
      if (!res.ok) throw new Error("Error al guardar");

      setNuevoUsuario({
        nombre: "",
        apellido: "",
        correo_electronico: "",
        contrasena: "",
        telefono: "",
        genero: "",
        rol: "",
      });
      setMostrarModal(false);
      await obtenerUsuarios();
      setPaginaActual(1);
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar el usuario.");
    }
  };

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditado({ ...usuario });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!usuarioEditado?.nombre?.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:3001/api/actualizarUsuarioPatch/${usuarioEditado.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuarioEditado),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar");
      setMostrarModalEdicion(false);
      await obtenerUsuarios();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el usuario.");
    }
  };

  const abrirModalEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarModalEliminacion(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/eliminarUsuario/${usuarioAEliminar.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Error al eliminar");
      setMostrarModalEliminacion(false);
      setUsuarioAEliminar(null);
      await obtenerUsuarios();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el usuario.");
    }
  };

  // -----------------------------
  // Paginación
  // -----------------------------
  const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPaginaActual(nuevaPagina);
  };

  // -----------------------------
  // Exportar Excel
  // -----------------------------
  const generarReporteExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Usuarios");
    sheet.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "Nombre", key: "nombre", width: 20 },
      { header: "Apellido", key: "apellido", width: 20 },
      { header: "Correo", key: "correo", width: 28 },
      { header: "Teléfono", key: "telefono", width: 15 },
      { header: "Rol", key: "rol", width: 15 },
    ];

    usuariosPaginados.forEach((u) => {
      sheet.addRow({
        id: u.id,
        nombre: u.nombre,
        apellido: u.apellido,
        correo: u.correo_electronico,
        telefono: u.telefono || "-",
        rol: u.rol || "-",
      });
    });

    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0D6EFD" } };
    sheet.getRow(1).alignment = { horizontal: "center", vertical: "middle" };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `reporte_usuarios_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

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
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "auto",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", padding: "70px" }}>
        <div
          className="position-relative p-4 rounded-4 shadow-lg animate-fade-in-smooth"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.85)", 
            maxWidth: "1000px",
            width: "100%",
            border: "3px solid #0d6efd",
            borderRadius: "20px",
            backdropFilter: "blur(8px)",
          }}
        >
          <h4 className="text-center mb-4 fw-bold text-primary">Gestión de Usuarios</h4>

          {!mostrarTabla && (
            <div className="text-center mb-3">
              <Button variant="primary" onClick={() => setMostrarTabla(true)}>Mostrar Usuarios</Button>
            </div>
          )}

          {mostrarTabla && (
            <div className="position-relative animate-fade-in-smooth">
              <Button
                variant="danger"
                size="sm"
                className="position-absolute"
                style={{ top: "-50px", right: "-20px", borderRadius: "50%", width: "35px", height: "35px" }}
                onClick={() => setMostrarTabla(false)}
              >
                X
              </Button>

              <Row className="mb-3 align-items-center mt-3">
                <Col lg={7} md={8} sm={12} className="mb-2 mb-md-0">
                  <CuadroBusquedas textoBusqueda={textoBusqueda} manejarCambioBusqueda={manejarCambioBusqueda} />
                </Col>
                <Col className="text-end d-flex justify-content-end flex-wrap gap-2">
                  <Button variant="primary" className="fw-bold px-4 shadow-sm" onClick={() => setMostrarModal(true)}>+ Nuevo</Button>
                  <Button variant="info" className="fw-bold px-4 shadow-sm text-white" onClick={generarReporteExcel}>📊 Reporte</Button>
                </Col>
              </Row>

              {esEscritorio ? (
                <TablaUsuario
                  usuarios={usuariosPaginados}
                  cargado={cargando}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                  totalElementos={usuariosFiltrados.length}
                  elementosPorPagina={elementosPorPagina}
                  paginaActual={paginaActual}
                  establecerPaginaActual={setPaginaActual}
                />
              ) : (
                <Row style={{ maxHeight: "60vh", overflowY: "auto", gap: "15px" }}>
                  {usuariosPaginados.map((u) => (
                    <Col md={6} lg={4} key={u.id}>
                      <Card className="mb-3 shadow-sm">
                        <Card.Body>
                          <Card.Title>{u.nombre} {u.apellido}</Card.Title>
                          <Card.Text><strong>Correo:</strong> {u.correo_electronico}</Card.Text>
                          <Card.Text><strong>Teléfono:</strong> {u.telefono || "-"}</Card.Text>
                          <Card.Text><strong>Rol:</strong> {u.rol}</Card.Text>
                          <div className="d-flex justify-content-between">
                            <Button variant="warning" size="sm" onClick={() => abrirModalEdicion(u)}>Editar</Button>
                            <Button variant="danger" size="sm" onClick={() => abrirModalEliminacion(u)}>Eliminar</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}

              {/* Paginación */}
              <div className="d-flex justify-content-center gap-2 mt-3">
                <Button variant="secondary" size="sm" onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>◀</Button>
                <span className="align-self-center">Página {paginaActual} de {totalPaginas}</span>
                <Button variant="secondary" size="sm" onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>▶</Button>
              </div>
            </div>
          )}

          <ModalRegistroUsuario
            mostrarModal={mostrarModal}
            setMostrarModal={setMostrarModal}
            nuevoUsuario={nuevoUsuario}
            setNuevoUsuario={setNuevoUsuario}
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
            mostrar={mostrarModalEliminacion}
            setMostrar={setMostrarModalEliminacion}
            usuario={usuarioAEliminar}
            confirmarEliminacion={confirmarEliminacion}
          />
        </div>
      </Container>

      <style jsx="true">{`
        .animate-fade-in-smooth {
          animation: fadeSlideSmooth 0.8s ease-out forwards;
        }
        @keyframes fadeSlideSmooth {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Usuario;
