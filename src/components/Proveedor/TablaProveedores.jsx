import { Table, Spinner } from "react-bootstrap";

const TablaProveedores = ({ proveedor, cargando }) => {

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
                        <th>ID</th>
                        <th>Nombre Proveedor</th>
                        <th>Teléfono</th>
                        <th>Tipo Distribuidor</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedor.map((proveedor) => {
                        return (
                            <tr key={proveedor.id_Proveedor}>
                                <td>{proveedor.id_Proveedor}</td>
                                <td>{proveedor.Nombre_Proveedor}</td>
                                <td>{proveedor.Telefono}</td>
                                <td>{proveedor.Tipo_distribuidor}</td>
                                <td>Modificar / Eliminar</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
};

export default TablaProveedores;
