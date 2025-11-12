import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TablaCompras from '../components/compras/TablaCompras';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroCompra from '../components/compras/ModalRegistroCompra';
import ModalEdicionCompra from '../components/compras/ModalEdicionCompra';
import ModalEliminacionCompra from '../components/compras/ModalEliminacionCompra';
import ModalDetallesCompra from '../components/DetalleCompra/ModalDetallesCompra';

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

  const [compraAEditar, setCompraAEditar] = useState(null);
  const [compraAEliminar, setCompraAEliminar] = useState(null);
  const [detallesCompra, setDetallesCompra] = useState([]);

  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const hoy = new Date().toISOString().split('T')[0];

  const [nuevaCompra, setNuevaCompra] = useState({
    id_Proveedor: '',
    Fe_compra: hoy
  });

  const [compraEnEdicion, setCompraEnEdicion] = useState(null);
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const comprasPaginadas = comprasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // ===================== FUNCIONES =====================

 const formatearFechaHora = (fechaISO) => {
    if (!fechaISO) return '—';
    const fecha = new Date(fechaISO);
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    let hours = fecha.getHours();
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${yyyy}-${mm}-${dd} ${hours}:${minutes} ${ampm}`;
  };

  // Exportar compras y detalles a Excel
  const exportarAExcel = async () => {
    if (compras.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // Crear un arreglo para Excel
    const datosParaExcel = [];
    for (const c of compras) {
      // Obtener detalles de cada compra
      let detalles = [];
      try {
        const resp = await fetch('http://localhost:3001/api/DetallesCompra');
        const todos = await resp.json();
        detalles = todos.filter(d => d.id_compra === c.id_compra);
      } catch (error) {
        console.error("Error cargando detalles para Excel:", error);
      }

      if (detalles.length === 0) {
        datosParaExcel.push({
          "ID Compra": c.id_compra,
          "Proveedor": c.nombre_proveedor,
          "Fecha Compra": c.Fe_compra,
          "Producto": "",
          "Cantidad": "",
          "Precio Unitario": "",
          "Fecha Ingresado": "",
          "Fecha Caducidad": ""
        });
      } else {
        for (const d of detalles) {
          datosParaExcel.push({
            "ID Compra": c.id_compra,
            "Proveedor": c.nombre_proveedor,
            "Fecha Compra": c.Fe_compra,
            "Producto": d.nombre_producto || '',
            "Cantidad": d.Cantidad || '',
            "Precio Unitario": d.Precio || '',
            "Fecha Ingresado": formatearFechaHora(d.Fe_Ingresado),
            "Fecha Caducidad": formatearFechaHora(d.Fe_caducidad)
          });
        }
      }
    }

    const ws = XLSX.utils.json_to_sheet(datosParaExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Compras");
    const archivoExcel = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([archivoExcel], { type: "application/octet-stream" }), "compras.xlsx");
  };

  // Obtener nombre del proveedor
  const obtenerNombreProveedor = async (idProveedor) => {
    if (!idProveedor) return '—';
    try {
      const resp = await fetch(`http://localhost:3001/api/proveedor/${idProveedor}`);
      if (!resp.ok) return '—';
      const data = await resp.json();
      return data.Nombre_Proveedor || data.nombre_proveedor || '—';
    } catch (error) {
      console.error("Error al cargar proveedor:", error);
      return '—';
    }
  };

  // Obtener nombre del producto
  const obtenerNombreProducto = async (idProducto) => {
    if (!idProducto) return '—';
    try {
      const resp = await fetch(`http://localhost:3001/api/producto/${idProducto}`);
      if (!resp.ok) return '—';
      const data = await resp.json();
      return data.nombre_producto || data.Nombre_Prod || '—';
    } catch (error) {
      console.error("Error al cargar producto:", error);
      return '—';
    }
  };

  // Obtener todas las compras
  const obtenerCompras = async () => {
    try {
      const resp = await fetch('http://localhost:3001/api/compras');
      if (!resp.ok) throw new Error('Error al cargar compras');
      const comprasRaw = await resp.json();

      const comprasConProveedor = await Promise.all(
        comprasRaw.map(async (c) => ({
          ...c,
          nombre_proveedor: await obtenerNombreProveedor(c.id_Proveedor),
          Fe_compra: formatearFechaHora(c.Fe_compra)
        }))
      );

      setCompras(comprasConProveedor);
      setComprasFiltradas(comprasConProveedor);
      setCargando(false);
    } catch (error) {
      console.error(error);
      alert("Error al cargar compras.");
      setCargando(false);
    }
  };

  // Obtener detalles de compra
  const obtenerDetallesCompra = async (id_compra) => {
    try {
      const resp = await fetch('http://localhost:3001/api/DetallesCompra');
      if (!resp.ok) throw new Error('Error al cargar detalles');
      const todos = await resp.json();
      const filtrados = todos.filter(d => d.id_compra === parseInt(id_compra));

      const detalles = await Promise.all(
        filtrados.map(async (d) => ({
          ...d,
          nombre_producto: await obtenerNombreProducto(d.id_Producto),
          Fe_Ingresado: formatearFechaHora(d.Fe_Ingresado),
          Fe_caducidad: formatearFechaHora(d.Fe_caducidad)
        }))
      );

      setDetallesCompra(detalles);
      setMostrarModalDetalles(true);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los detalles.");
    }
  };

  // Obtener lista de proveedores
  const obtenerProveedores = async () => {
    try {
      const resp = await fetch('http://localhost:3001/api/proveedores');
      if (!resp.ok) throw new Error('Error al cargar proveedores');
      const datos = await resp.json();
      setProveedores(datos);
    } catch (error) {
      console.error(error);
    }
  };

  // Obtener lista de productos
  const obtenerProductos = async () => {
    try {
      const resp = await fetch('http://localhost:3001/api/producto');
      if (!resp.ok) throw new Error('Error al cargar productos');
      const datos = await resp.json();
      setProductos(datos);
    } catch (error) {
      console.error(error);
    }
  };

  // Filtrar compras
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = compras.filter(c =>
      c.id_compra.toString().includes(texto) ||
      (c.nombre_proveedor && c.nombre_proveedor.toLowerCase().includes(texto))
    );
    setComprasFiltradas(filtrados);
    setPaginaActual(1);
  };

  // Agregar nueva compra
  const agregarCompra = async () => {
    if (!nuevaCompra.id_Proveedor || detallesNuevos.length === 0) {
      alert("Completa proveedor y al menos un detalle.");
      return;
    }

    try {
      const compraResp = await fetch('http://localhost:3001/api/registrarcompra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCompra)
      });

      if (!compraResp.ok) throw new Error('Error al crear compra');
      const { id_compra } = await compraResp.json();

      for (const d of detallesNuevos) {
        await fetch('http://localhost:3001/api/registrarDetalleCompra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...d, id_compra })
        });
      }

      await obtenerCompras();
      cerrarModalRegistro();
    } catch (error) {
      console.error(error);
      alert("Error al registrar compra.");
    }
  };

  // Abrir modal de edición
  const abrirModalEdicion = async (compra) => {
    setCompraAEditar(compra);

    setCompraEnEdicion({
      id_Proveedor: compra.id_Proveedor,
      Fe_compra: new Date(compra.Fe_compra).toISOString().split("T")[0]
    });

    const resp = await fetch('http://localhost:3001/api/DetallesCompra');
    const todos = await resp.json();
    const detallesRaw = todos.filter(d => d.id_compra === compra.id_compra);

    const detalles = await Promise.all(
      detallesRaw.map(async (d) => ({
        id_Producto: d.id_Producto,
        nombre_producto: await obtenerNombreProducto(d.id_Producto),
        cantidad: d.Cantidad,
        precio_unitario: d.Precio,
        fe_ingresado: formatearFechaHora(d.Fe_Ingresado),
        fe_caducidad: formatearFechaHora(d.Fe_caducidad)
      }))
    );

    setDetallesNuevos(detalles);
    setMostrarModalEdicion(true);
  };

  // Actualizar compra
  const actualizarCompra = async () => {
    try {
      await fetch(`http://localhost:3001/api/actualizarcompra/${compraAEditar.id_compra}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraEnEdicion)
      });

      const resp = await fetch('http://localhost:3001/api/DetallesCompra');
      const todos = await resp.json();
      const actuales = todos.filter(d => d.id_compra === compraAEditar.id_compra);

      for (const d of actuales) {
        await fetch(`http://localhost:3001/api/eliminarDetalleCompra/${d.id_DetalleCompra}`, { method: 'DELETE' });
      }

      for (const d of detallesNuevos) {
        await fetch('http://localhost:3001/api/registrarDetalleCompra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...d, id_compra: compraAEditar.id_compra })
        });
      }

      await obtenerCompras();
      cerrarModalEdicion();
    } catch (error) {
      alert("Error al actualizar.");
    }
  };

  // Eliminar compra
  const abrirModalEliminacion = (compra) => {
    setCompraAEliminar(compra);
    setMostrarModalEliminar(true);
  };

  const eliminarCompra = async () => {
    try {
      await fetch(`http://localhost:3001/api/eliminarcompra/${compraAEliminar.id_compra}`, { method: 'DELETE' });
      await obtenerCompras();
      setMostrarModalEliminar(false);
    } catch (error) {
      alert("No se pudo eliminar.");
    }
  };
// Cerrar modales
  const cerrarModalRegistro = () => {
    setMostrarModalRegistro(false);
    setNuevaCompra({ id_Proveedor: '', Fe_compra: hoy });
    setDetallesNuevos([]);
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
    setCompraAEditar(null);
    setCompraEnEdicion(null);
    setDetallesNuevos([]);
  };

  // Cargar al iniciar
  useEffect(() => {
    obtenerCompras();
    obtenerProveedores();
    obtenerProductos();
  }, []);

  // ===================== RENDER =====================
  return (
    <Container className="mt-4">
      <h4>Compras</h4>
      <Row>
        <Col lg={5} md={6} sm={8} xs={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        +<Col className="text-end d-flex justify-content-end flex-wrap gap-2">
          {/* Botón Nueva Compra */}
          <Button
            variant="success"
            size="sm"
            className="fw-bold px-3 py-1 shadow-sm"
            onClick={() => setMostrarModalRegistro(true)}
          >
            + Compra
          </Button>

          {/* Botón Exportar Excel */}
          <Button
            variant="info"
            size="sm"
            className="fw-bold px-3 py-1 shadow-sm text-white"
            onClick={exportarAExcel} // tu función para exportar
          >
            📄 Excel
          </Button>
        </Col>

      </Row>

      <TablaCompras
        compras={comprasPaginadas}
        cargando={cargando}
        obtenerDetalles={obtenerDetallesCompra}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={comprasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />

      <ModalRegistroCompra
        mostrar={mostrarModalRegistro}
        setMostrar={cerrarModalRegistro}
        nuevaCompra={nuevaCompra}
        setNuevaCompra={setNuevaCompra}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        proveedores={proveedores}
        productos={productos}
        agregarCompra={agregarCompra}
        hoy={hoy}
      />

      <ModalEdicionCompra
        mostrar={mostrarModalEdicion}
        setMostrar={cerrarModalEdicion}
        compra={compraAEditar}
        compraEnEdicion={compraEnEdicion}
        setCompraEnEdicion={setCompraEnEdicion}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        proveedores={proveedores}
        productos={productos}
        actualizarCompra={actualizarCompra}
      />

      <ModalEliminacionCompra
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        compra={compraAEliminar}
        confirmarEliminacion={eliminarCompra}
      />

      <ModalDetallesCompra
        mostrarModal={mostrarModalDetalles}
        setMostrarModal={() => setMostrarModalDetalles(false)}
        detalles={detallesCompra}
      />
    </Container>
  );
};

export default Compras;
