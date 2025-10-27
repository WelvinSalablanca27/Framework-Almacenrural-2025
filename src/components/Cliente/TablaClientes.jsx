import {Table, Spinner} from 'react-bootstrap';

const TablaClientes = ({ clientes, cargado }) => {

    if (cargado)
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
                        <th>Nombre1 </th>
                        <th>Nombre2</th>
                        <th>Apellido1</th>
                        <th>Apellido2</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id_Cliente}>
                            <td>{cliente.id_Cliente}</td>
                            <td>{cliente.Nombre1}</td>
                            <td>{cliente.Nombre2}</td>
                            <td>{cliente.Apellido1}</td>
                            <td>{cliente.Apellido2}</td>
                            <td>{cliente.Direccion}</td>
                            <td>{cliente.Telefono}</td>
                            <td>Agregar/Eliminar/Editar</td>
                        </tr>
                    ))}


                </tbody>
            </Table >
        </>
    );
}
export default TablaClientes;