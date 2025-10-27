import {Table, Spinner} from 'react-bootstrap';

const TablaUsuario = ({ usuarios, cargado }) => {

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
                        <th>nombre </th>
                        <th>apellido </th>
                        <th>correo_electronico </th>
                        <th>contraseña </th>
                        <th>telefono </th>
                        <th>genero</th>
                        <th>rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.apellido}</td>
                            <td>{usuario.correo_electronico}</td>
                            <td>{usuario.contrasena}</td>
                            <td>{usuario.telefono}</td>
                            <td>{usuario.genero}</td>
                            <td>{usuario.rol}</td>
                            <td>{usuario.apellido}</td>

                            <td>Eliminar/Agregar/Actualizar</td>
                        </tr>
                    ))}



                </tbody>
            </Table >
        </>
    );
}
export default TablaUsuario;