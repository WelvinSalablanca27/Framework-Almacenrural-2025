import { useEffect, useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
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
        obtenerClientes();
    }, []);

    
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

   
    const toggleSeleccion = (id) => {
        setClientesSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const clientePaginadas = clientesFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );

  
    const generarPDFClientes = () => {
        // mismo código que tenías
    };

    const exportarExcelClientes = () => {
        // mismo código que tenías
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
        </div>
    );
};

export default Cliente;
