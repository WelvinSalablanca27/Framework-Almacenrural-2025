import { useEffect, useState } from "react"; 
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaProductos from "../components/Producto/TablaProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroProducto from "../components/Producto/ModalRegistroProducto";
import ModalEdicionProducto from "../components/Producto/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/Producto/ModalEliminacionProducto";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const fondoalmacenrural =
  "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    Nombre_Prod: "",
    Tipo_Prod: "",
    Existencia_Prod: "",
    stock: "",
    Precio_Costo: "",
    Precio_Venta: "",
    Fe_caducidad: "",
  });

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminado, setProductoAEliminado] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // -----------------------------
  // CRUD y Fetch
  // -----------------------------
  const obtenerProductos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/producto");
      if (!res.ok) throw new Error("Error al obtener productos");
      const datos = await res.json();
      setProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error(error);
      setCargando(false);
    }
  };

  useEffect(() => {
    if (mostrarTabla) obtenerProductos();
  }, [mostrarTabla]);

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
      const res = await fetch("http://localhost:3001/api/registrarProducto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setNuevoProducto({
        Nombre_Prod: "",
        Tipo_Prod: "",
        Existencia_Prod: "",
        stock: "",
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
      const res = await fetch(
        `http://localhost:3001/api/actualizarProducto/${productoEditado.id_Producto}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoEditado),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar");
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
      const res = await fetch(
        `http://localhost:3001/api/eliminarProducto/${productoAEliminado.id_Producto}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Error al eliminar");
      setMostrarModalEliminacion(false);
      setProductoAEliminado(null);
      await obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el producto.");
    }
  };

  const productoPaginadas = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const generarReporteExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Productos");
    sheet.columns = [
      { header: "ID Producto", key: "id", width: 12 },
      { header: "Nombre", key: "nombre", width: 28 },
      { header: "Tipo", key: "tipo", width: 15 },
      { header: "Existencia", key: "existencia", width: 12 },
      { header: "Stock", key: "stock", width: 10 },
      { header: "Precio Costo", key: "costo", width: 15 },
      { header: "Precio Venta", key: "venta", width: 15 },
      { header: "Caducidad", key: "fecha", width: 18 },
    ];
    productoPaginadas.forEach((p) => {
      sheet.addRow({
        id: p.id_Producto,
        nombre: p.Nombre_Prod,
        tipo: p.Tipo_Prod || "-",
        existencia: p.Existencia_Prod || 0,
        stock: p.stock || 0,
        costo: `C$${parseFloat(p.Precio_Costo || 0).toFixed(2)}`,
        venta: `C$${parseFloat(p.Precio_Venta || 0).toFixed(2)}`,
        fecha: p.Fe_caducidad || "-",
      });
    });
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF28A745" } };
    sheet.getRow(1).alignment = { horizontal: "center", vertical: "middle" };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `reporte_productos_${new Date().toISOString().split("T")[0]}.xlsx`);
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
            backgroundColor: "rgba(255,255,255,0.75)",
            maxWidth: "1000px",
            width: "100%",
            border: "3px solid #28a745",
            borderRadius: "20px",
            backdropFilter: "blur(8px)",
          }}
        >
          <h4 className="text-center mb-4 fw-bold text-success">Gestión de Productos</h4>

          {!mostrarTabla && (
            <div className="text-center mb-3">
              <Button variant="success" onClick={() => setMostrarTabla(true)}>Mostrar Productos</Button>
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
                  <Button variant="success" className="fw-bold px-4 shadow-sm" onClick={() => setMostrarModal(true)}>+ Nuevo</Button>
                  <Button variant="info" className="fw-bold px-4 shadow-sm text-white" onClick={generarReporteExcel}>📊 Reporte</Button>
                </Col>
              </Row>

              <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "8px" }}>
                <TablaProductos
                  productos={productoPaginadas}
                  cargando={cargando}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>
            </div>
          )}

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

export default Producto;