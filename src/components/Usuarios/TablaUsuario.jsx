import { useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaUsuario = ({
  usuarios,
  cargado,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
}) => {
  const [orden, setOrden] = useState({ campo: "id", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    const valorA = a[orden.campo];
    const valorB = b[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargado)
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    );

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <BotonOrden campo="id" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>
            <BotonOrden campo="nombre" orden={orden} manejarOrden={manejarOrden}>
              Nombre
            </BotonOrden>
            <BotonOrden campo="apellido" orden={orden} manejarOrden={manejarOrden}>
              Apellido
            </BotonOrden>
            <BotonOrden campo="correo_electronico" orden={orden} manejarOrden={manejarOrden}>
              Correo Electrónico
            </BotonOrden>
            <BotonOrden campo="contrasena" orden={orden} manejarOrden={manejarOrden}>
              Contraseña
            </BotonOrden>
            <BotonOrden campo="telefono" orden={orden} manejarOrden={manejarOrden}>
              Teléfono
            </BotonOrden>
            <BotonOrden campo="genero" orden={orden} manejarOrden={manejarOrden}>
              Género
            </BotonOrden>
            <BotonOrden campo="rol" orden={orden} manejarOrden={manejarOrden}>
              Rol
            </BotonOrden>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosOrdenados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.correo_electronico}</td>
              <td>{usuario.contrasena}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.genero}</td>
              <td>{usuario.rol}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(usuario)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(usuario)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

export default TablaUsuario;
