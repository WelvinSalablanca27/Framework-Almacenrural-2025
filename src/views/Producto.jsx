import { useEffect, useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaProductos from "../components/Producto/TablaProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroProducto from "../components/Producto/ModalRegistroProducto";
import ModalEdicionProducto from "../components/Producto/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/Producto/ModalEliminacionProducto";

// Excel
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const fondoalmacenrural =
  "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    Nombre_Prod: "",
    Tipo_Prod: "",
    Existencia_Prod: "",
    Precio_Costo: "",
    Precio_Venta: "",
    Fe_caducidad: "",
  });

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminado, setProductoAEliminado] = useState(null);

  const [minimizado, setMinimizado] = useState(false);
  const [animado, setAnimado] = useState(false);

  // -----------------------------
  // CRUD
  // -----------------------------
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3001/api/producto");
      if (!respuesta.ok) throw new Error("Error al obtener productos");
      const datos = await respuesta.json();
      setProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
    // activar animación después de montar
    setTimeout(() => setAnimado(true), 50);
  }, []);

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtrados = productos.filter(
      (p) =>
        p.Nombre_Prod.toLowerCase().includes(texto) ||
        p.id_Producto.toString().includes(texto)
    );
    setProductosFiltrados(filtrados);
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.Nombre_Prod.trim()) return;
    try {
      const respuesta = await fetch("http://localhost:3001/api/registrarProducto", {
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
        Fe_caducidad: "",
      });
      setMostrarModal(false);
      await obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar el producto.");
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditado({ ...producto });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!productoEditado?.Nombre_Prod?.trim()) return;
    try {
      const respuesta = await fetch(
        `http://localhost:3001/api/actualizarProducto/${productoEditado.id_Producto}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoEditado),
        }
      );
      if (!respuesta.ok) throw new Error("Error al actualizar");
      setMostrarModalEdicion(false);
      await obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el producto.");
    }
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminado(producto);
    setMostrarModalEliminacion(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3001/api/eliminarProducto/${productoAEliminado.id_Producto}`,
        { method: "DELETE" }
      );
      if (!respuesta.ok) throw new Error("Error al eliminar");
      setMostrarModalEliminacion(false);
      setProductoAEliminado(null);
      await obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el producto.");
    }
  };


  const generarReporteExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Productos");

    sheet.columns = [
      { header: "ID Producto", key: "id", width: 10 },
      { header: "Nombre", key: "nombre", width: 25 },
      { header: "Tipo", key: "tipo", width: 15 },
      { header: "Existencia", key: "existencia", width: 10 },     
      { header: "Precio Costo", key: "costo", width: 15 },
      { header: "Precio Venta", key: "venta", width: 15 },
      { header: "Fecha Caducidad", key: "fecha", width: 20 },
    ];

    productosFiltrados.forEach((p) => {
      sheet.addRow({
        id: p.id_Producto,
        nombre: p.Nombre_Prod,
        tipo: p.Tipo_Prod,
        existencia: p.Existencia_Prod,      
        costo: p.Precio_Costo,
        venta: p.Precio_Venta,
        fecha: p.Fe_caducidad,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "reporte_productos.xlsx");
  };

  // -----------------------------
  // Render
  // -----------------------------
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
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", padding: "70px" }}
      >

        <div
          className={`position-relative p-4 rounded-4 shadow-lg`}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.67)",
            maxWidth: "900px",
            width: "145%",
            border: "3px solid #28a745",
            borderRadius: "20px",
            backdropFilter: "blur(8px)",
            transition: "all 0.5s ease",
            transform: animado ? "translateY(0) scale(1)" : "translateY(50px) scale(0.9)",
            opacity: animado ? 1 : 0,
          }}
        >
          <h4 className="text-center mb-4 fw-bold text-success">Registro de Productos</h4>

          <Row className="mb-3 align-items-center">
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
                onClick={() => setMostrarModal(true)}
              >
                Nuevo
              </Button>
              <Button
                variant="info"
                className="fw-bold px-4 shadow-sm text-white"
                onClick={generarReporteExcel}
              >
                📊 Reporte
              </Button>
            </Col>
          </Row>

          <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "8px" }}>
            <TablaProductos
              productos={productosFiltrados}
              cargando={cargando}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </div>

          <ModalRegistroProducto
            mostrarModal={mostrarModal}
            setMostrarModal={setMostrarModal}
            nuevoProducto={nuevoProducto}
            setNuevoProducto={setNuevoProducto}
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
            mostrar={mostrarModalEliminacion}
            setMostrar={setMostrarModalEliminacion}
            productoEliminado={productoAEliminado}
            confirmarEliminacion={confirmarEliminacion}
          />
        </div>

      </Container>
    </div>
  );
};

export default Producto;
