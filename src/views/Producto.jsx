import { useEffect, useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import TablaProductos from "../components/Producto/TablaProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroProducto from "../components/Producto/ModalRegistroProducto";
import ModalEdicionProducto from "../components/Producto/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/Producto/ModalEliminacionProducto";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const fondoalmacenrural = "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const productosIniciales = [
  { id_Producto: 1, Nombre_Prod: "Antipulgas Bravecto", Tipo_Prod: "Medicamento", stock: 15, Precio_Costo: 9800, Precio_Venta: 125000, Fe_caducidad: "2026-08-15" },
  { id_Producto: 2, Nombre_Prod: "Vacuna Triple Felina", Tipo_Prod: "Vacuna", stock: 8, Precio_Costo: 55000, Precio_Venta: 75000 },
  { id_Producto: 3, Nombre_Prod: "Shampoo Medicado", Tipo_Prod: "Higiene", stock: 30, Precio_Costo: 18000, Precio_Venta: 28000 },
  { id_Producto: 4, Nombre_Prod: "Alimento Pro Plan 3kg", Tipo_Prod: "Alimento", stock: 12, Precio_Costo: 72000, Precio_Venta: 89000 },
  { id_Producto: 5, Nombre_Prod: "Collar Isabelino", Tipo_Prod: "Accesorio", stock: 25, Precio_Costo: 9000, Precio_Venta: 15000 },
  { id_Producto: 6, Nombre_Prod: "Desparasitante Milbemax", Tipo_Prod: "Medicamento", stock: 40, Precio_Costo: 28000, Precio_Venta: 38000, Fe_caducidad: "2026-06-30" },
];

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    Nombre_Prod: "", Tipo_Prod: "", stock: "", Precio_Costo: "", Precio_Venta: "", Fe_caducidad: ""
  });
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminado, setProductoAEliminado] = useState(null);
  const [minimizado, setMinimizado] = useState(false);

  // Cargar datos
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
    const filtrados = productos.filter(p =>
      p.Nombre_Prod.toLowerCase().includes(texto) ||
      p.id_Producto.toString().includes(texto)
    );
    setProductosFiltrados(filtrados);
  };

  const agregarProducto = () => {
    if (!nuevoProducto.Nombre_Prod.trim()) return;
    const nuevo = {
      id_Producto: Date.now(),
      ...nuevoProducto,
      stock: parseInt(nuevoProducto.stock) || 0,
      Precio_Costo: parseFloat(nuevoProducto.Precio_Costo) || 0,
      Precio_Venta: parseFloat(nuevoProducto.Precio_Venta) || 0,
    };
    const actualizados = [...productos, nuevo];
    setProductos(actualizados);
    setProductosFiltrados(actualizados);
    setNuevoProducto({ Nombre_Prod: "", Tipo_Prod: "", stock: "", Precio_Costo: "", Precio_Venta: "", Fe_caducidad: "" });
    setMostrarModal(false);
  };

  const abrirModalEdicion = (p) => {
    setProductoEditado({ ...p });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = () => {
    const actualizados = productos.map(p => p.id_Producto === productoEditado.id_Producto ? productoEditado : p);
    setProductos(actualizados);
    setProductosFiltrados(actualizados);
    setMostrarModalEdicion(false);
  };

  const abrirModalEliminacion = (p) => {
    setProductoAEliminado(p);
    setMostrarModalEliminacion(true);
  };

  const confirmarEliminacion = () => {
    const actualizados = productos.filter(p => p.id_Producto !== productoAEliminado.id_Producto);
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
      { header: "Stock", key: "stock", width: 12 },
      { header: "Precio Venta", key: "venta", width: 15 },
    ];
    productosFiltrados.forEach(p => {
      sheet.addRow({
        id: p.id_Producto,
        nombre: p.Nombre_Prod,
        tipo: p.Tipo_Prod || "-",
        stock: p.stock || 0,
        venta: `C$${Number(p.Precio_Venta || 0).toFixed(2)}`,
      });
    });
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF28A745" } };
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Reporte_Productos_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div style={{
      backgroundImage: `url(${fondoalmacenrural})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      padding: "70px 10px 20px",
    }}>
      <Container fluid className="px-3">
        <div className="bg-white rounded-4 shadow-lg p-4 position-relative" style={{
          maxWidth: "100%",
          border: "4px solid #28a745",
          borderRadius: "20px",
        }}>
          {/* Botón X */}
          <Button
            variant="danger"
            size="sm"
            className="position-absolute top-0 end-0 m-3 rounded-circle"
            style={{ width: "40px", height: "40px", zIndex: 10 }}
            onClick={() => setMinimizado(true)}
          >X</Button>

          <h4 className="text-center mb-4 fw-bold text-success fs-5">
            Registro de Productos
          </h4>

          {/* Búsqueda + Botones */}
          <Row className="g-3 mb-4">
            <Col xs={12}>
              <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                manejarCambioBusqueda={manejarCambioBusqueda}
              />
            </Col>
            <Col xs={12} className="d-flex gap-2">
              <Button variant="success" className="flex-fill py-3 fw-bold" onClick={() => setMostrarModal(true)}>
                + Nuevo
              </Button>
              <Button variant="info" className="flex-fill py-3 fw-bold text-white" onClick={generarReporteExcel}>
                Reporte
              </Button>
            </Col>
          </Row>

          {/* TABLA CON PAGINACIÓN ARRIBA */}
          <div style={{ minHeight: "55vh" }}>
            <TablaProductos
              productos={productosFiltrados}
              cargando={cargando}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </div>
        </div>

        {/* Botón flotante minimizado */}
        {minimizado && (
          <Button
            variant="success"
            className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg"
            style={{ width: "70px", height: "70px", fontSize: "32px", zIndex: 1000 }}
            onClick={() => setMinimizado(false)}
          >+</Button>
        )}
      </Container>

      {/* MODALES */}
      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        setNuevoProducto={setNuevoProducto}
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
  );
};

export default Producto;