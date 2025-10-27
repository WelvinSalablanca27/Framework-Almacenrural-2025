import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import TablaUsuario from "../components/Usuarios/TablaUsuario";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    const obtenerUsuarios = async () => {
        try {
            const respuesta = await fetch("http://localhost:3000/api/Usuarios");

            if (!respuesta.ok) {
                throw new Error("Error al obtener las usuarios");
            }
            const datos = await respuesta.json();

            setUsuarios(datos);
            setCargando(false);
        } catch (error) {
            console.log(error.message);
            setCargando(false);
        }
    }

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    return (
        <>
            <Container className="mt-4">
                <h4>Usuarios</h4>
                <TablaUsuario
                    usuarios={usuarios}
                    cargando={cargando} />
            </Container>
        </>
    );
}

export default Usuarios;