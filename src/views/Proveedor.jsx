import { useEffect, useState } from "react";
import { Container, Col, Row, Button, Card } from "react-bootstrap";
import TablaProveedores from "../components/proveedor/TablaProveedores";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroProveedor from "../components/proveedor/ModalRegistroProveedor";
import ModalEdicionProveedor from "../components/proveedor/ModalEdicionProveedor";
import ModalEliminacionProveedor from "../components/proveedor/ModalEliminacionProveedor";

// PDF
import jsPDF from "jspdf";
import "jspdf-autotable";

// Excel
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const fondoalmacenrural =
    "https://i.pinimg.com/736x/76/fb/4a/76fb4a687980c6b31824bc0752d66f10.jpg";

const Proveedor = () => {
    const [proveedores, setProveedores] = useState([]);
    const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoProveedor, setNuevoProveedor] = useState({
        Nombre_Proveedor: "",
        Telefono: "",
        Email: "",
        Direccion: "",
        Tipo_Distribuidor: "",
        Condiciones_Pago: "",
        Estado: "Activo",
    });

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [proveedorEditado, setProveedorEditado] = useState(null);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

    // OBTENER PROVEEDORES
    const obtenerProveedores = async () => {
        try {
            const respuesta = await fetch("http://localhost:3001/api/proveedores");
            const datos = await respuesta.json();
            setProveedores(datos);
            setProveedoresFiltrados(datos);
            setCargando(false);
        } catch (error) {
            console.error(error);
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerProveedores();
    }, []);

    // BUSCAR
    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);
        const filtrados = proveedores.filter(
            (p) =>
                p.Nombre_Proveedor.toLowerCase().includes(texto) ||
                p.id_Proveedor.toString().includes(texto)
        );
        setProveedoresFiltrados(filtrados);
    };

    // AGREGAR
    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoProveedor((prev) => ({ ...prev, [name]: value }));
    };

    const agregarProveedor = async () => {
        if (!nuevoProveedor.Nombre_Proveedor.trim()) return;
        try {
            await fetch("http://localhost:3001/api/registrarProveedor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProveedor),
            });

            setNuevoProveedor({
                Nombre_Proveedor: "",
                Telefono: "",
                Email: "",
                Direccion: "",
                Tipo_Distribuidor: "",
                Condiciones_Pago: "",
                Estado: "Activo",
            });
            setMostrarModal(false);
            obtenerProveedores();
        } catch (error) {
            console.error(error);
        }
    };

    // EDITAR
    const abrirModalEdicion = (proveedor) => {
        setProveedorEditado({ ...proveedor });
        setMostrarModalEdicion(true);
    };

    const guardarEdicion = async () => {
        try {
            await fetch(
                `http://localhost:3001/api/actualizarProveedor/${proveedorEditado.id_Proveedor}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(proveedorEditado),
                }
            );

            setMostrarModalEdicion(false);
            obtenerProveedores();
        } catch (error) {
            console.error(error);
        }
    };

    // ELIMINAR
    const abrirModalEliminacion = (proveedor) => {
        setProveedorAEliminar(proveedor);
        setMostrarModalEliminacion(true);
    };

    const confirmarEliminacion = async () => {
        try {
            await fetch(
                `http://localhost:3001/api/eliminarProveedor/${proveedorAEliminar.id_Proveedor}`,
                { method: "DELETE" }
            );

            setMostrarModalEliminacion(false);
            obtenerProveedores();
        } catch (error) {
            console.error(error);
        }
    };

    // EXCEL / PDF
    const generarReporteExcel = async () => {
        // ...mismo código de ExcelJS que ya tienes
    };

    const generarReportePDF = () => {
        // ...mismo código de jsPDF que ya tienes
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
                position: "fixed",
                top: 0,
                left: 0,
                overflow: "auto",
            }}
        >
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh" }}
            >
                {/* TARJETA CON TABLA */}
                <Card
                    className="shadow-lg p-3 rounded-4 position-relative animate-fade-in-smooth"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                        border: "3px solid #198754",
                        maxWidth: "860px",
                        width: "100%",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <h4 className="text-center mb-3 fw-bold text-success">
                        Registro de Proveedores
                    </h4>

                    <Row className="mb-2 align-items-center">
                        <Col lg={7} md={8} sm={12} className="mb-2 mb-md-0">
                            <CuadroBusquedas
                                textoBusqueda={textoBusqueda}
                                manejarCambioBusqueda={manejarCambioBusqueda}
                            />
                        </Col>

                        <Col className="text-end d-flex justify-content-end flex-wrap gap-2">
                            <Button
                                variant="success"
                                className="fw-bold px-3 py-1 shadow-sm"
                                onClick={() => setMostrarModal(true)}
                            >
                                + Nuevo
                            </Button>

                            <Button
                                variant="info"
                                className="fw-bold px-3 py-1 shadow-sm text-white"
                                onClick={generarReportePDF}
                            >
                                📝 PDF
                            </Button>

                            <Button
                                variant="info"
                                className="fw-bold px-3 py-1 shadow-sm text-white"
                                onClick={generarReporteExcel}
                            >
                                📊 Excel
                            </Button>
                        </Col>
                    </Row>

                    <div
                        style={{
                            maxHeight: "50vh",
                            overflowY: "auto",
                            paddingRight: "6px",
                        }}
                    >
                        <TablaProveedores
                            proveedores={proveedoresFiltrados}
                            cargando={cargando}
                            abrirModalEdicion={abrirModalEdicion}
                            abrirModalEliminacion={abrirModalEliminacion}
                        />
                    </div>

                    {/* MODALES */}
                    <ModalRegistroProveedor
                        mostrarModal={mostrarModal}
                        setMostrarModal={setMostrarModal}
                        nuevoProveedor={nuevoProveedor}
                        setNuevoProveedor={setNuevoProveedor}
                        manejarCambioInput={manejarCambioInput}
                        agregarProveedor={agregarProveedor}
                        listaProveedores={proveedores}
                    />

                    <ModalEdicionProveedor
                        mostrar={mostrarModalEdicion}
                        setMostrar={setMostrarModalEdicion}
                        proveedorEditado={proveedorEditado}
                        setProveedorEditado={setProveedorEditado}
                        guardarEdicion={guardarEdicion}
                    />

                    <ModalEliminacionProveedor
                        mostrar={mostrarModalEliminacion}
                        setMostrar={setMostrarModalEliminacion}
                        proveedorEliminado={proveedorAEliminar}
                        confirmarEliminacion={confirmarEliminacion}
                    />
                </Card>
            </Container>
        </div>
    );
};

export default Proveedor;
