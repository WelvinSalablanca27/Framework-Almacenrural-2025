import { useEffect, useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaProductos from "../components/Producto/TablaProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroProducto from "../components/Producto/ModalRegistroProducto";
import ModalEdicionProducto from "../components/Producto/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/Producto/ModalEliminacionProducto";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const fondoalmacenrural = "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const productosIniciales = [
  { id_Producto: 1, Nombre_Prod: "Antipulgas Bravecto", Tipo_Prod: "Medicamento", Existencia_Prod: 15, stock: 15, Precio_Costo: 98000, Precio_Venta: 125000, Fe_caducidad: "2026-08-15" },
  { id_Producto: 2, Nombre_Prod: "Vacuna Triple Felina", Tipo_Prod: "Vacuna", Existencia_Prod: 8, stock: 8, Precio_Costo: 55000, Precio_Venta: 75000, Fe_caducidad: "2025-12-10" },
  { id_Producto: 3, Nombre_Prod: "Shampoo Medicado", Tipo_Prod: "Higiene", Existencia_Prod: 30, stock: 30, Precio_Costo: 18000, Precio_Venta: 28000, Fe_caducidad: "2027-03-20" },
  { id_Producto: 4, Nombre_Prod: "Alimento Pro Plan 3kg", Tipo_Prod: "Alimento", Existencia_Prod: 12, stock: 12, Precio_Costo: 72000, Precio_Venta: 89000, Fe_caducidad: null },
  { id_Producto: 5, Nombre_Prod: "Collar Isabelino", Tipo_Prod: "Accesorio", Existencia_Prod: 25, stock: 25, Precio_Costo: 9000, Precio_Venta: 15000, Fe_caducidad: null },
  { id_Producto: 6, Nombre_Prod: "Desparasitante Milbemax", Tipo_Prod: "Medicamento", Existencia_Prod: 40, stock: 40, Precio_Costo: 28000, Precio_Venta: 38000, Fe_caducidad: "2026-06-30" },
];

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
    stock: "",
    Precio_Costo: "",
    Precio_Venta: "",
    Fe_caducidad: "",
  });
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminado, setProductoAEliminado] = useState(null);

  // NUEVOS ESTADOS
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [minimizado, setMinimizado] = useState(false);

  // Cargar productos de localStorage o iniciales
  useEffect(() => {
    const guardados = localStorage.getItem("productosAlmacenRural");
    if (guardados) {
      const datos = JSON.parse(guardados);
      setProductos(datos);
      setProductosFiltrados(datos);
    } else {
      setProductos(productosIniciales);
      setProductosFiltrados(productosIniciales);
      localStorage.setItem("productosAlmacenRural", JSON.stringify(productosIniciales));
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      localStorage.setItem("productosAlmacenRural", JSON.stringify(productos));
    }
  }, [productos]);

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

  const agregarProducto = () => {
    if (!nuevoProducto.Nombre_Prod.trim()) return;
    const nuevo = {
      id_Producto: Date.now(),
      ...nuevoProducto,
      Existencia_Prod: parseInt(nuevoProducto.Existencia_Prod) || 0,
      stock: parseInt(nuevoProducto.stock) || 0,
      Precio_Costo: parseFloat(nuevoProducto.Precio_Costo) || 0,
      Precio_Venta: parseFloat(nuevoProducto.Precio_Venta) || 0,
    };
    const actualizados = [...productos, nuevo];
    setProductos(actualizados);
    setProductosFiltrados(actualizados);
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
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditado({ ...producto });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = () => {
    if (!productoEditado?.Nombre_Prod?.trim()) return;
    const actualizados = productos.map((p) =>
      p.id_Producto === productoEditado.id_Producto ? productoEditado : p
    );
    setProductos(actualizados);
    setProductosFiltrados(actualizados);
    setMostrarModalEdicion(false);
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminado(producto);
    setMostrarModalEliminacion(true);
  };

  const confirmarEliminacion = () => {
    const actualizados = productos.filter((p) => p.id_Producto !== productoAEliminado.id_Producto);
    setProductos(actualizados);
    setProductosFiltrados(actualizados);
    setMostrarModalEliminacion(false);
    setProductoAEliminado(null);
  };

  const generarReporteExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Productos");
    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Tipo", key: "tipo", width: 15 },
      { header: "Stock", key: "stock", width: 10 },
      { header: "Precio Costo", key: "costo", width: 15 },
      { header: "Precio Venta", key: "venta", width: 15 },
      { header: "Caducidad", key: "fecha", width: 15 },
    ];
    productosFiltrados.forEach((p) => {
      sheet.addRow({
        id: p.id_Producto,
        nombre: p.Nombre_Prod,
        tipo: p.Tipo_Prod || "-",
        stock: p.stock || 0,
        costo: `C$${parseFloat(p.Precio_Costo || 0).toFixed(2)}`,
        venta: `C$${parseFloat(p.Precio_Venta || 0).toFixed(2)}`,
        fecha: p.Fe_caducidad || "-",
      });
    });
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF28A745" } };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `Reporte_Productos_${new Date().toISOString().split("T")[0]}.xlsx`);
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
      <Container style={{ minHeight: "100vh", padding: "20px" }}>
        
        {/* PANEL DE INFORMACIÓN */}
        {!mostrarTabla && (
          <div
            style={{
              position: "fixed",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, 0)",
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "20px 25px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              zIndex: 2000,
              textAlign: "center",
              maxWidth: "90%",
              width: "360px"
            }}
          >
            <h5 className="mb-3 fw-bold text-success">Información</h5>
            <p>Esta tabla está relacionada con la entidad <strong>Productos</strong>. Aquí podrás ver, registrar y editar los productos existentes.</p>

            <Button
              variant="success"
              className="fw-bold"
              style={{ marginTop: "10px", width: "100%" }}
              onClick={() => {
                setMinimizado(false);
                setMostrarTabla(true);
              }}
            >
              Ver Tabla de Productos
            </Button>
          </div>
        )}

        {/* TABLA */}
        {mostrarTabla && (
          <div
            className="position-relative p-3 shadow-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              width: "95%",
              maxWidth: "750px",
              margin: "50px auto 20px",
              border: "1.5px solid #28a745",
              borderRadius: "25px",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
              transform: minimizado ? "scale(0)" : "scale(1)",
              opacity: minimizado ? 0 : 1,

              // MEJORAS PARA TELÉFONOS
              padding: "15px",
              maxHeight: "85vh",
              overflowY: "auto"
            }}
          >
            {/* BOTÓN X */}
            <Button
              variant="danger"
              size="sm"
              className="position-absolute top-0 end-0 m-2"
              style={{ zIndex: 10, borderRadius: "50%", width: "36px", height: "36px" }}
              onClick={() => {
                setMinimizado(true);
                setMostrarTabla(false);
              }}
            >
              X
            </Button>

            <h4 className="text-center mb-4 fw-bold text-success">Registro de Productos</h4>

            <Row className="mb-3 align-items-center">
              <Col xs={12} md={7} className="mb-2">
                <CuadroBusquedas textoBusqueda={textoBusqueda} manejarCambioBusqueda={manejarCambioBusqueda} />
              </Col>
              <Col xs={12} md={5} className="d-flex justify-content-end gap-2 mb-2">
                <Button variant="success" className="fw-bold" onClick={() => setMostrarModal(true)}>
                  + Nuevo
                </Button>
                <Button variant="info" className="fw-bold text-white" onClick={generarReporteExcel}>
                  Reporte
                </Button>
              </Col>
            </Row>

            <div
              style={{
                maxHeight: "55vh",
                overflowY: "auto",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch"
              }}
            >
              <div style={{ minWidth: "300px", width: "100%" }}>
                <TablaProductos
                  productos={productosFiltrados}
                  cargando={cargando}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>
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
        )}
      </Container>
    </div>
  );
};

export default Producto;
