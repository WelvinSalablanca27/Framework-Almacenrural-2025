import { Table, Button, Pagination, Spinner } from "react-bootstrap";

const TablaVenta = ({
  ventas,
  cargando,
  obtenerDetalles,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
}) => {
  if (cargando)
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando ventas...</span>
        </Spinner>
      </div>
    );

  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

  return (
    <>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas?.map((v) => {
            const nombreCliente = v.Nombre1
              ? `${v.Nombre1} ${v.Nombre2 || ""} ${v.Apellido1 || ""} ${v.Apellido2 || ""}`.trim()
              : `ID Cliente: ${v.id_Cliente}`;

            return (
              <tr key={v.id_ventas}>
                <td>{v.id_ventas}</td>
                <td>{new Date(v.Fe_Venta).toLocaleString()}</td>
                <td>{nombreCliente}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-info"
                    onClick={() => obtenerDetalles(v.id_ventas)}
                  >
                    Detalles
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="outline-warning"
                    onClick={() => abrirModalEdicion(v)}
                  >
                    Editar
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => abrirModalEliminacion(v)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(totalPaginas)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === paginaActual}
            onClick={() => establecerPaginaActual(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </>
  );
};

export default TablaVenta;
