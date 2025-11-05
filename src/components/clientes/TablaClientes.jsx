import { useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";


const TablaClientes = ({ clientes, cargando, abrirModalEdicion, abrirModalEliminacion, totalElementos,
    elementosPorPagina,
    paginaActual,
    establecerPaginaActual
}) => {
    const [orden, setOrden] = useState({ campo: "id_Cliente", direccion: "asc" });
    const manejarOrden = (campo) => {
        setOrden((prev) => ({
            campo,
            direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
        }));
    };


    const clientesOrdenadas = [...clientes].sort((a, b) => {
        const valorA = a[orden.campo];
        const valorB = b[orden.campo];

        if (typeof valorA === "number" && typeof valorB === "number") {
            return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
        }

        const comparacion = String(valorA).localeCompare(String(valorB));
        return orden.direccion === "asc" ? comparacion : -comparacion;
    });
    if (cargando)
        return (
            <>

                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </>

        );
    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <BotonOrden campo="id_Cliente" orden={orden} manejarOrden={manejarOrden}>
                            ID
                        </BotonOrden>

                        <BotonOrden campo="Nombre1" orden={orden} manejarOrden={manejarOrden}>
                            Primer Nombre
                        </BotonOrden>

                        <BotonOrden campo="Nombre2" orden={orden} manejarOrden={manejarOrden}>
                            Segundo Nombre
                        </BotonOrden>

                        <BotonOrden campo="Apellido1" orden={orden} manejarOrden={manejarOrden}>
                            Primer Apellido
                        </BotonOrden>

                        <BotonOrden campo="Apellido2" orden={orden} manejarOrden={manejarOrden}>
                            Segundo Apellido
                        </BotonOrden>

                        <BotonOrden campo="Direccion" orden={orden} manejarOrden={manejarOrden}>
                            Direccion
                        </BotonOrden>

                        <BotonOrden campo="Telefono" orden={orden} manejarOrden={manejarOrden}>
                            Telefono
                        </BotonOrden>

                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientesOrdenadas.map((cliente) => (
                        <tr key={cliente.id_Cliente}>
                            <td>{cliente.id_Cliente}</td>
                            <td>{cliente.Nombre1}</td>
                            <td>{cliente.Nombre2}</td>
                            <td>{cliente.Apellido1}</td>
                            <td>{cliente.Apellido2}</td>
                            <td>{cliente.Direccion}</td>
                            <td>{cliente.Telefono}</td>
                            <td>
                                <td>
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => abrirModalEdicion(cliente)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => abrirModalEliminacion(cliente)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table >
            <Paginacion
                elementosPorPagina={elementosPorPagina}
                totalElementos={totalElementos}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
            />


        </>
    );
};
export default TablaClientes;
