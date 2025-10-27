 import {useState,useEffect} from 'react';
import TablaClientes from '../components/Cliente/TablaClientes.jsx';
import { Container, Col, Row, Button } from 'react-bootstrap';
import CuadroBusquedas from '../components/Busqueda/CuadroBusquedas.jsx';
<compone></compone>


const Cliente = () => {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");


    const obtenerClientes = async () => {
        try {
            const respuesta = await fetch("http://localhost:3000/api/clientes");

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
                <h4>Cliente</h4>
                <Row>
                    <Col lg={5} md={6} sm={8} xs={7}>
                        <CuadroBusquedas
                            textoBusqueda={textoBusqueda}
                            manejarCambioBusqueda={manejarCambioBusqueda}
                        />
                    </Col>
                </Row>
                <TablaClientes
                    clientes={clientesFiltrados}
                    cargando={cargando} />
            </Container>
        </>
    );
}


export default Cliente;