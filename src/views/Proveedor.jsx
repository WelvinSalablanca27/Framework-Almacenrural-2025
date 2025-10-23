import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import TablaProveedores from "../components/proveedor/TablaProveedores";

const Proveedor = () => {
    const [proveedor, setProveedor] = useState([]);
    const [cargando, setCargando] = useState(true);

    const obtenerProveedores = async () => {
        try {
            const respuesta = await fetch("http://localhost:3001/api/proveedor");
            
            if (!respuesta.ok) throw new Error("Error al obtener los proveedores");

            const datos = await respuesta.json();
            setProveedor(datos);
        } catch  (error) {
            console.error(error.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerProveedores();
    }, []);

    return (
        <Container className="mt-4">
            <h4>Lista de Proveedores</h4>
            <TablaProveedores
             proveedor={proveedor}
             cargado={cargando} />
        </Container>
    );
};

export default Proveedor;
