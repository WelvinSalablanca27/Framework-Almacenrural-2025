import { useEffect, useState } from "react";
import { Container, Col, Row, Button } from 'react-bootstrap';
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaClientes from '../components/clientes/TablaClientes';
import ModalRegistroCliente from '../components/clientes/ModalRegistroCliente';
import ModalEdicionCliente from '../components/clientes/ModalEdicionCliente';
import ModalEliminacionCliente from '../components/clientes/ModalEliminacionCliente';


const Cliente = () => {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState({
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        celular: "",
        direccion: "",
        cedula: ""
    });

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

    const [clienteEditada, setClienteEditada] = useState(null);
    const [clienteAEliminar, setClienteAEliminar] = useState(null);

    const abrirModalEdicion = (clientes) => {
        setClienteEditada({ ...clientes });
        setMostrarModalEdicion(true);
    };

    const guardarEdicion = async () => {
        if (!clienteEditada.primer_nombre.trim()) return;
        try {
            const respuesta = await fetch(`http://localhost:3001/api/actualizarCliente/${clienteEditada.id_cliente}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteEditada)
            });
            if (!respuesta.ok) throw new Error('Error al actualizar');
            setMostrarModalEdicion(false);
            await obtenerClientes();
        } catch (error) {
            console.error("Error al editar clientes:", error);
            alert("No se pudo actualizar la clientes.");
        }
    };

    const abrirModalEliminacion = (clientes) => {
        setClienteAEliminar(clientes);
        setMostrarModalEliminar(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const respuesta = await fetch(`http://localhost:3001/api/eliminarCliente/${clienteAEliminar.id_cliente}`, {
                method: 'DELETE',
            });
            if (!respuesta.ok) throw new Error('Error al eliminar');
            setMostrarModalEliminar(false);
            setClienteAEliminar(null);
            await obtenerClientes();
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
            alert("No se pudo eliminar la cliente.");
        }
    };
    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoCliente((prev) => ({ ...prev, [name]: value }));
    };

    const agregarCliente = async () => {
        if (!nuevoCliente.primer_nombre.trim()) return;

        try {
            const respuesta = await fetch("http://localhost:3001/api/registrarCliente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoCliente),
            }
            );

            if (!respuesta.ok) throw new Error("Error al guardar");

            // Limpiar y cerrar
            setNuevoCliente({
                primer_nombre: "",
                segundo_nombre: "",
                primer_apellido: "",
                segundo_apellido: "",
                celular: "",
                direccion: "",
                cedula: ""
            });
            setMostrarModal(false);
            await obtenerClientes(); // Refresca la lista
        } catch (error) {
            console.error("Error al agregar el cliente:", error);
            alert("No se pudo guardar el cliente. Revisa la consola.");
        }
    };

    const obtenerClientes = async () => {
        try {
            const respuesta = await fetch("http://localhost:3001/api/clientes");

            if (!respuesta.ok) {
                throw new Error("Error al obtener los clientes");
            }
            const datos = await respuesta.json();

            setClientes(datos);
            setClientesFiltrados(datos);
            setCargando(false);
        } catch (error) {
            console.log(error.message);
            setCargando(false);
        }
    }

    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);

        const filtrados = clientes.filter(
            (clientes) =>
                clientes.primer_nombre.toLowerCase().includes(texto) ||
                clientes.id_cliente.toString().includes(texto)

        );
        setClientesFiltrados(filtrados);
    };


    useEffect(() => {
        obtenerClientes();
    }, []);

    return (
        <>
            <Container className="mt-4">
                <h4>Clientes</h4>
                <Row>
                    <Col lg={5} md={6} sm={8} xs={7}>
                        <CuadroBusquedas
                            textoBusqueda={textoBusqueda}
                            manejarCambioBusqueda={manejarCambioBusqueda}
                        />
                    </Col>

                    <Col className="text-end">
                        <Button className="color-boton-registro" onClick={() => setMostrarModal(true)}>
                            + Nuevo Cliente
                        </Button>
                    </Col>

                </Row>
                <TablaClientes
                    clientes={clientesFiltrados}
                    cargando={cargando}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                />

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

            </Container>
        </>
    );
}


export default Cliente;