import { useEffect, useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaProveedores from "../components/proveedor/TablaProveedores";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroProveedor from "../components/proveedor/ModalRegistroProveedor";
import ModalEdicionProveedor from "../components/proveedor/ModalEdicionProveedor";
import ModalEliminacionProveedor from "../components/proveedor/ModalEliminacionProveedor";

// PDF
import jsPDF from "jspdf";
import "jspdf-autotable";

// Excel (opcional)
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

    const [minimizado, setMinimizado] = useState(false);

    // -----------------------------
    // CRUD
    // -----------------------------
    const obtenerProveedores = async () => {
        try {
            const respuesta = await fetch("http://localhost:3001/api/proveedores");
            if (!respuesta.ok) throw new Error("Error al obtener proveedores");
            const datos = await respuesta.json();
            setProveedores(datos);
            setProveedoresFiltrados(datos);
            setCargando(false);
        } catch (error) {
            console.error(error.message);
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerProveedores();
    }, []);

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

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoProveedor((prev) => ({ ...prev, [name]: value }));
    };

    const agregarProveedor = async () => {
        if (!nuevoProveedor.Nombre_Proveedor.trim()) return;
        try {
            const respuesta = await fetch("http://localhost:3001/api/registrarProveedor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProveedor),
            });
            if (!respuesta.ok) throw new Error("Error al guardar");

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
            await obtenerProveedores();
        } catch (error) {
            console.error(error);
            alert("No se pudo guardar el proveedor.");
        }
    };

    const abrirModalEdicion = (proveedor) => {
        setProveedorEditado({ ...proveedor });
        setMostrarModalEdicion(true);
    };

    const guardarEdicion = async () => {
        if (!proveedorEditado?.Nombre_Proveedor?.trim()) return;
        try {
            const respuesta = await fetch(
                `http://localhost:3001/api/actualizarProveedor/${proveedorEditado.id_Proveedor}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(proveedorEditado),
                }
            );
            if (!respuesta.ok) throw new Error("Error al actualizar");
            setMostrarModalEdicion(false);
            await obtenerProveedores();
        } catch (error) {
            console.error(error);
            alert("No se pudo actualizar el proveedor.");
        }
    };

    const abrirModalEliminacion = (proveedor) => {
        setProveedorAEliminar(proveedor);
        setMostrarModalEliminacion(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const respuesta = await fetch(
                `http://localhost:3001/api/eliminarProveedor/${proveedorAEliminar.id_Proveedor}`,
                { method: "DELETE" }
            );
            if (!respuesta.ok) throw new Error("Error al eliminar");
            setMostrarModalEliminacion(false);
            setProveedorAEliminar(null);
            await obtenerProveedores();
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el proveedor.");
        }
    };

    // -----------------------------
    // Generar Excel
    // -----------------------------
    const generarReporteExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Proveedores");

        sheet.columns = [
            { header: "ID", key: "id", width: 8 },
            { header: "Nombre", key: "nombre", width: 25 },
            { header: "Teléfono", key: "telefono", width: 15 },
            { header: "Email", key: "email", width: 25 },
            { header: "Dirección", key: "direccion", width: 30 },
            { header: "Tipo Distribuidor", key: "tipo", width: 18 },
            { header: "Cond. Pago", key: "pago", width: 15 },
            { header: "Estado", key: "estado", width: 10 },
            { header: "Registro", key: "fecha", width: 20 },
        ];

        proveedoresFiltrados.forEach((p) => {
            sheet.addRow({
                id: p.id_Proveedor,
                nombre: p.Nombre_Proveedor,
                telefono: p.Telefono || "-",
                email: p.Email || "-",
                direccion: p.Direccion || "-",
                tipo: p.Tipo_Distribuidor || "-",
                pago: p.Condiciones_Pago || "-",
                estado: p.Estado || "Activo",
                fecha: new Date(p.Fecha_Registro).toLocaleDateString(),
            });
        });

        sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
        sheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF198754" },
        };
        sheet.getRow(1).alignment = { horizontal: "center", vertical: "middle" };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, `reporte_proveedores_${new Date().toISOString().split("T")[0]}.xlsx`);
    };

    // -----------------------------
    // Generar PDF
    // -----------------------------
    const generarReportePDF = () => {
        const doc = new jsPDF();

        doc.setFillColor(25, 135, 84);
        doc.rect(14, 10, doc.internal.pageSize.width - 28, 20, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont(undefined, "bold");
        doc.text("Reporte de Proveedores", doc.internal.pageSize.width / 2, 25, { align: "center" });

        const head = [["ID", "Nombre", "Teléfono", "Email", "Dirección", "Tipo Distribuidor", "Cond. Pago", "Estado", "Registro"]];

        const body = proveedoresFiltrados.map((p) => [
            p.id_Proveedor,
            p.Nombre_Proveedor,
            p.Telefono || "-",
            p.Email || "-",
            p.Direccion || "-",
            p.Tipo_Distribuidor || "-",
            p.Condiciones_Pago || "-",
            p.Estado || "Activo",
            new Date(p.Fecha_Registro).toLocaleDateString(),
        ]);

        let totalPagesExp = "{total_pages_count_string}";
        doc.autoTable({
            head,
            body,
            startY: 40,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [25, 135, 84], textColor: 255, fontStyle: "bold" },
            didDrawPage: (data) => {
                let str = `Página ${doc.internal.getNumberOfPages()}`;
                if (typeof doc.putTotalPages === "function") str += " de " + totalPagesExp;
                doc.setFontSize(10);
                doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
            },
        });

        if (typeof doc.putTotalPages === "function") doc.putTotalPages(totalPagesExp);

        const fecha = new Date().toISOString().split("T")[0];
        doc.save(`Proveedores_${fecha}.pdf`);
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
                    className="position-relative p-4 rounded-4 shadow-lg"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.67)",
                        maxWidth: "900px",
                        width: "145%",
                        border: "3px solid #198754",
                        borderRadius: "20px",
                        backdropFilter: "blur(8px)",
                        transition: "all 0.4s ease",
                        transform: minimizado ? "scale(0)" : "scale(1)",
                        opacity: minimizado ? 0 : 1,
                        pointerEvents: minimizado ? "none" : "all",
                    }}
                >
                    <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2 fw-bold"
                        style={{ zIndex: 10, borderRadius: "50%", width: "36px", height: "36px" }}
                        onClick={() => setMinimizado(true)}
                    >
                        X
                    </Button>

                    <h4 className="text-center mb-4 fw-bold text-success">
                        Registro de Proveedores
                    </h4>

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
                                + Nuevo
                            </Button>
                            <Button
                                variant="info"
                                className="fw-bold px-4 shadow-sm text-white"
                                onClick={generarReportePDF}
                            >
                                📝 PDF
                            </Button>
                            <Button
                                variant="info"
                                className="fw-bold px-4 shadow-sm text-white"
                                onClick={generarReporteExcel}
                            >
                                📊 Excel
                            </Button>
                        </Col>
                    </Row>

                    <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "8px" }}>
                        <TablaProveedores
                            proveedores={proveedoresFiltrados}
                            cargando={cargando}
                            abrirModalEdicion={abrirModalEdicion}
                            abrirModalEliminacion={abrirModalEliminacion}
                        />
                    </div>

                    <ModalRegistroProveedor
                        mostrarModal={mostrarModal}
                        setMostrarModal={setMostrarModal}
                        nuevoProveedor={nuevoProveedor}
                        setNuevoProveedor={setNuevoProveedor}
                        manejarCambioInput={manejarCambioInput}
                        agregarProveedor={agregarProveedor}
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
                </div>

                {minimizado && (
                    <Button
                        variant="success"
                        className="position-fixed bottom-0 end-0 m-4 shadow-lg"
                        style={{
                            zIndex: 1000,
                            borderRadius: "50%",
                            width: "60px",
                            height: "60px",
                            fontSize: "24px",
                        }}
                        onClick={() => setMinimizado(false)}
                    >
                        +
                    </Button>
                )}
            </Container>
        </div>
    );
};

export default Proveedor;
