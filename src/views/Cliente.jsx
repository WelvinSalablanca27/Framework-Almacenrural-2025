import { useEffect, useState } from "react";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaClientes from "../components/clientes/TablaClientes";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const fondoalmacenrural =
    "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Cliente = () => {

    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [nuevoCliente, setNuevoCliente] = useState({
        Nombre1: "",
        Nombre2: "",
        Apellido1: "",
        Apellido2: "",
        Direccion: "",
        Telefono: "",
    });

    const [clienteEditada, setClienteEditada] = useState(null);
    const [clienteAEliminar, setClienteAEliminar] = useState(null);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

    const [paginaActual, establecerPaginaActual] = useState(1);
    const elementosPorPagina = 5;

    const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
    const [mostrarTabla, setMostrarTabla] = useState(false);

    // -------------------------------
    // Fetch clientes
    // -------------------------------
    const obtenerClientes = async () => {
        try {
            const respuesta = await fetch("http://localhost:3001/api/clientes");
            if (!respuesta.ok) throw new Error("Error al obtener los clientes");

            const datos = await respuesta.json();
            setClientes(datos);
            setClientesFiltrados(datos);
            setCargando(false);
        } catch (error) {
            console.error(error);
            setCargando(false);
        }
    };

    useEffect(() => {
        if (mostrarTabla) {
            obtenerClientes();
        }
    }, [mostrarTabla]);

    // -------------------------------
    // Buscador
    // -------------------------------
    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);

        const filtrados = clientes.filter(
            (c) =>
                c.Nombre1.toLowerCase().includes(texto) ||
                c.Apellido1.toLowerCase().includes(texto) ||
                c.id_Cliente.toString().includes(texto)
        );

        setClientesFiltrados(filtrados);
    };

    // -------------------------------
    // CRUD
    // -------------------------------
    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoCliente((prev) => ({ ...prev, [name]: value }));
    };

    const agregarCliente = async () => {
        if (!nuevoCliente.Nombre1.trim()) return;

        try {
            const respuesta = await fetch("http://localhost:3001/api/registrarCliente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoCliente),
            });

            if (!respuesta.ok) throw new Error("Error al guardar");

            setNuevoCliente({
                Nombre1: "",
                Nombre2: "",
                Apellido1: "",
                Apellido2: "",
                Direccion: "",
                Telefono: "",
            });
            setMostrarModal(false);
            await obtenerClientes();
        } catch (error) {
            console.error(error);
            alert("No se pudo guardar el cliente.");
        }
    };

    const abrirModalEdicion = (cliente) => {
        setClienteEditada({ ...cliente });
        setMostrarModalEdicion(true);
    };

    const guardarEdicion = async () => {
        if (!clienteEditada.Nombre1.trim()) return;
        try {
            const respuesta = await fetch(
                `http://localhost:3001/api/actualizarCliente/${clienteEditada.id_Cliente}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(clienteEditada),
                }
            );
            if (!respuesta.ok) throw new Error("Error al actualizar");
            setMostrarModalEdicion(false);
            await obtenerClientes();
        } catch (error) {
            console.error(error);
            alert("No se pudo actualizar el cliente.");
        }
    };

    const abrirModalEliminacion = (cliente) => {
        setClienteAEliminar(cliente);
        setMostrarModalEliminar(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const respuesta = await fetch(
                `http://localhost:3001/api/eliminarCliente/${clienteAEliminar.id_Cliente}`,
                { method: "DELETE" }
            );
            if (!respuesta.ok) throw new Error("Error al eliminar");
            setMostrarModalEliminar(false);
            setClienteAEliminar(null);
            await obtenerClientes();
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el cliente.");
        }
    };

    // -------------------------------
    // Selección de clientes
    // -------------------------------
    const toggleSeleccion = (id) => {
        setClientesSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const seleccionarTodos = () => {
        const ids = clientePaginadas.map((c) => c.id_Cliente);
        if (ids.every((id) => clientesSeleccionados.includes(id))) {
            setClientesSeleccionados((prev) => prev.filter((id) => !ids.includes(id)));
        } else {
            setClientesSeleccionados((prev) => [...new Set([...prev, ...ids])]);
        }
    };

    // -------------------------------
    // Paginación
    // -------------------------------
    const clientePaginadas = clientesFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );

    // -------------------------------
    // Export PDF / Excel
    // -------------------------------
    const generarPDFClientes = () => {
        const doc = new jsPDF();
        doc.setFillColor(0, 123, 255);
        doc.rect(14, 10, 182, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("Lista de Clientes", 105, 20, { align: "center" });

        const encabezados = [["ID", "Nombre Completo", "Dirección", "Teléfono"]];
        const datos = clientes.map((c) => [
            c.id_Cliente,
            `${c.Nombre1} ${c.Nombre2} ${c.Apellido1} ${c.Apellido2}`.replace(/\s+/g, " ").trim(),
            c.Direccion || "—",
            c.Telefono || "—",
        ]);

        doc.autoTable({
            head: encabezados,
            body: datos,
            startY: 35,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [0, 123, 255], textColor: 255, fontStyle: "bold" },
            columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 60 }, 2: { cellWidth: 50 }, 3: { cellWidth: 30 } },
        });

        const fecha = new Date().toLocaleDateString("es-ES").replace(/\//g, "-");
        doc.save(`Clientes_${fecha}.pdf`);
    };

    const exportarExcelClientes = () => {
        const datos = clientes.map((c) => ({
            ID: c.id_Cliente,
            Nombre: `${c.Nombre1} ${c.Nombre2} ${c.Apellido1} ${c.Apellido2}`.replace(/\s+/g, " ").trim(),
            Dirección: c.Direccion,
            Teléfono: c.Telefono,
        }));
        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Clientes");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        const fecha = new Date().toLocaleDateString("es-ES").replace(/\//g, "-");
        saveAs(data, `Clientes_${fecha}.xlsx`);
    };

    // -------------------------------
    // Render
    // -------------------------------
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
                padding: 0,
                margin: 0,
                position: "fixed",
                top: 0,
                left: 0,
                overflow: "auto",
            }}
        >
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", padding: "70px" }}>
                <div
                    className="position-relative p-4 rounded-4 shadow-lg"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.75)",
                        maxWidth: "1000px",
                        width: "100%",
                        border: "3px solid #198754",
                        borderRadius: "20px",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <h4 className="text-center mb-4 fw-bold text-success">Gestión de Clientes</h4>

                    {/* BOTÓN PARA MOSTRAR TABLA */}
                    {!mostrarTabla && (
                        <div className="text-center mb-3">
                            <Button
                                variant="success"
                                onClick={() => setMostrarTabla(true)}
                            >
                                Mostrar Clientes
                            </Button>
                        </div>
                    )}

                    {mostrarTabla && (
                        <div className="animate-fade-in-smooth position-relative">
                            {/* X para cerrar tabla */}
                            <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute animate-fade-in-smooth"
                                style={{
                                    top: "-60px",
                                    right: "-20px",
                                    borderRadius: "50%",
                                    width: "35px",
                                    height: "35px",
                                    padding: 0,
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                }}
                                onClick={() => setMostrarTabla(false)}
                            >
                                X
                            </Button>

                            {/* Buscador y botones */}
                            <Row className="mb-3 align-items-center mt-3">
                                <Col lg={7} md={8} sm={12} className="mb-2 mb-md-0">
                                    <CuadroBusquedas textoBusqueda={textoBusqueda} manejarCambioBusqueda={manejarCambioBusqueda} />
                                </Col>
                                <Col className="text-end d-flex justify-content-end flex-wrap gap-2">
                                    <Button variant="success" className="fw-bold px-4 shadow-sm" onClick={() => setMostrarModal(true)}>+ Nuevo</Button>
                                    <Button variant="primary" className="fw-bold px-4 shadow-sm" onClick={generarPDFClientes}>PDF</Button>
                                    <Button variant="success" className="fw-bold px-4 shadow-sm" onClick={exportarExcelClientes}>Excel</Button>
                                </Col>
                            </Row>

                            {/* Tabla */}
                            <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "8px" }}>
                                <TablaClientes
                                    clientes={clientePaginadas}
                                    cargando={cargando}
                                    abrirModalEdicion={abrirModalEdicion}
                                    abrirModalEliminacion={abrirModalEliminacion}
                                    totalElementos={clientes.length}
                                    elementosPorPagina={elementosPorPagina}
                                    paginaActual={paginaActual}
                                    establecerPaginaActual={establecerPaginaActual}
                                    clientesSeleccionados={clientesSeleccionados}
                                    toggleSeleccion={toggleSeleccion}
                                />
                            </div>
                        </div>
                    )}

                    {/* Modales */}
                    <ModalRegistroCliente
                        mostrarModal={mostrarModal}
                        setMostrarModal={setMostrarModal}
                        nuevoCliente={nuevoCliente}
                        manejarCambioInput={manejarCambioInput}
                        agregarCliente={agregarCliente}
                    />
                    <ModalEdicionCliente
                        mostrar={mostrarModalEdicion}
                        setMostrar={setMostrarModalEdicion}
                        clienteEditada={clienteEditada}
                        setClienteEditada={setClienteEditada}
                        guardarEdicion={guardarEdicion}
                    />
                    <ModalEliminacionCliente
                        mostrar={mostrarModalEliminar}
                        setMostrar={setMostrarModalEliminar}
                        cliente={clienteAEliminar}
                        confirmarEliminacion={confirmarEliminacion}
                    />
                </div>
            </Container>

            {/* Animación CSS */}
            <style jsx="true">{`
                .animate-fade-in-smooth {
                    animation: fadeSlideSmooth 0.8s ease-out forwards;
                }
                @keyframes fadeSlideSmooth {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Cliente;