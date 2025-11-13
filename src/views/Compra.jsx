import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TablaCompras from '../components/compras/TablaCompras';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroCompra from '../components/compras/ModalRegistroCompra';
import ModalEdicionCompra from '../components/compras/ModalEdicionCompra';
import ModalEliminacionCompra from '../components/compras/ModalEliminacionCompra';
import ModalDetallesCompra from '../components/DetalleCompra/ModalDetallesCompra';

import jsPDF from "jspdf";
import "jspdf-autotable";
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

  // === GENERAR PDF GENERAL DE COMPRAS ===
  const generarPDFCompras = () => {
    const doc = new jsPDF();

    // Encabezado con fondo azul
    doc.setFillColor(0, 102, 204);
    doc.rect(14, 10, doc.internal.pageSize.width - 28, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text("Reporte de Compras", doc.internal.pageSize.width / 2, 25, { align: "center" });

    // Columnas
    const head = [["ID", "Proveedor", "Fecha Compra", "Total Productos", "Monto Total"]];

    // Filas
    const data = compras.map(c => {
      const totalProductos = c.detalles ? c.detalles.reduce((sum, d) => sum + d.Cantidad, 0) : 0;
      const montoTotal = c.detalles ? c.detalles.reduce((sum, d) => sum + (d.Cantidad * d.Precio), 0) : 0;
      return [
        c.id_compra,
        c.nombre_proveedor || '—',
        c.Fe_compra,
        totalProductos,
        `$${montoTotal.toFixed(2)}`
      ];
    });

    // Marcador de páginas
    let totalPagesExp = "{total_pages_count_string}";

    // Configuración de tabla
    doc.autoTable({
      head: head,
      body: data,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: 'bold' },
      didDrawPage: (data) => {
        // Pie de página con número de página
        let str = `Página ${doc.internal.getNumberOfPages()}`;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.setFontSize(10);
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    // Actualizar total de páginas
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    // Guardar
    const fecha = new Date().toISOString().split('T')[0];
    doc.save(`Compras_${fecha}.pdf`);
  };

  // === GENERAR PDF DETALLE DE UNA COMPRA ===
  const generarPDFDetalleCompra = async (compra) => {
    const doc = new jsPDF();

    // Cargar detalles
    let detalles = [];
    try {
      const resp = await fetch('http://localhost:3001/api/DetallesCompra');
      const todos = await resp.json();
      detalles = todos.filter(d => d.id_compra === compra.id_compra);
    } catch (error) {
      console.error("Error cargando detalles:", error);
    }

    // Encabezado
    doc.setFillColor(0, 102, 204);
    doc.rect(14, 10, doc.internal.pageSize.width - 28, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(`Compra #${compra.id_compra}`, doc.internal.pageSize.width / 2, 25, { align: "center" });

    // Info general
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Proveedor: ${compra.nombre_proveedor}`, 20, 40);
    doc.text(`Fecha: ${compra.Fe_compra}`, 20, 48);

    // Tabla de productos
    const head = [["Producto", "Cant.", "Precio Unit.", "Subtotal", "Ing.", "Cad."]];
    const body = await Promise.all(detalles.map(async (d) => {
      const nombreProd = await obtenerNombreProducto(d.id_Producto);
      const subtotal = d.Cantidad * d.Precio;
      return [
        nombreProd,
        d.Cantidad,
        `$${d.Precio.toFixed(2)}`,
        `$${subtotal.toFixed(2)}`,
        formatearFechaHora(d.Fe_Ingresado),
        formatearFechaHora(d.Fe_caducidad)
      ];
    }));

    doc.autoTable({
      head: head,
      body: body,
      startY: 60,
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 102, 204] }
    });

    // Total
    const total = detalles.reduce((sum, d) => sum + (d.Cantidad * d.Precio), 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: $${total.toFixed(2)}`, doc.internal.pageSize.width - 50, doc.autoTable.previous.finalY + 15);

    // Imagen del producto (si existe)
    const productoConImagen = detalles.find(d => d.imagen);
    if (productoConImagen && productoConImagen.imagen) {
      try {
        doc.addPage();
        doc.text("Imagen del Producto", 20, 20);
        doc.addImage(productoConImagen.imagen, 'JPEG', 20, 30, 80, 80);
      } catch (err) {
        console.warn("No se pudo cargar imagen:", err);
      }
    }

    const fecha = new Date().toISOString().split('T')[0];
    doc.save(`Compra_${compra.id_compra}_${fecha}.pdf`);
  };

  // === EXPORTAR A EXCEL ===
  const exportarExcelCompras = async () => {
    if (compras.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const datosParaExcel = [];
    for (const c of compras) {
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
            "Producto": await obtenerNombreProducto(d.id_Producto),
            "Cantidad": d.Cantidad,
            "Precio Unitario": d.Precio,
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
    const fecha = new Date().toISOString().split('T')[0];
    saveAs(new Blob([archivoExcel], { type: "application/octet-stream" }), `Compras_${fecha}.xlsx`);
  };

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
      setMostrarModalRegistro(false);
      setNuevaCompra({ id_Proveedor: '', Fe_compra: hoy });
      setDetallesNuevos([]);
    } catch (error) {
      console.error(error);
      alert("Error al registrar compra.");
    }
  };

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
      setMostrarModalEdicion(false);
      setCompraAEditar(null);
      setCompraEnEdicion(null);
      setDetallesNuevos([]);
    } catch (error) {
      alert("Error al actualizar.");
    }
  };

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

  useEffect(() => {
    obtenerCompras();
    obtenerProveedores();
    obtenerProductos();
  }, []);

  // ===================== RENDER =====================
  return (
    <Container className="mt-4">
      <h4>Compras</h4>
      <Row className="mb-3 align-items-center">
        <Col lg={4} md={5} sm={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end d-flex justify-content-end flex-wrap gap-2">
          <Button
            variant="success"
            size="sm"
            className="fw-bold px-3 py-1 shadow-sm"
            onClick={() => setMostrarModalRegistro(true)}
          >
            + Compra
          </Button>

          <Button
            variant="danger"
            size="sm"
            className="fw-bold px-3 py-1 shadow-sm text-white"
            onClick={generarPDFCompras}
          >
            📄 PDF
          </Button>

          <Button
            variant="info"
            size="sm"
            className="fw-bold px-3 py-1 shadow-sm text-white"
            onClick={exportarExcelCompras}
          >
            📊 Excel
          </Button>
        </Col>
      </Row>

      <TablaCompras
        compras={comprasPaginadas}
        cargando={cargando}
        obtenerDetalles={obtenerDetallesCompra}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        generarPDFDetalleCompra={generarPDFDetalleCompra}
        totalElementos={comprasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />

      <ModalRegistroCompra
        mostrar={mostrarModalRegistro}
        setMostrar={setMostrarModalRegistro}
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
        setMostrar={setMostrarModalEdicion}
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
        setMostrarModal={setMostrarModalDetalles}
        detalles={detallesCompra}
      />
    </Container>
  );
};

export default Compras;