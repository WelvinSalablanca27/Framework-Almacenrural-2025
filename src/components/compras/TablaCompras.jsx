import { Table, Button, Pagination, Spinner } from "react-bootstrap";

const TablaCompras = ({
  compras = [],
  cargando = false,
  obtenerDetalles,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos = 0,
  elementosPorPagina = 5,
  paginaActual = 1,
  establecerPaginaActual,
}) => {
  // Mostrar spinner mientras carga
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Cargando compras...</p>
      </div>
    );
  }

  // Si no hay compras
  if (compras.length === 0) {
    return (
      <p className="text-center text-muted py-5">
        No hay compras registradas.
      </p>
    );
  }

  // Cálculo de páginas
  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

  return (
    <>
      <Table
        striped
        bordered
        hover
        responsive
        className="mt-3 text-center align-middle shadow-sm"
      >
        <thead className="bg-success text-white">
          <tr>
            <th>ID Compra</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((c) => (
            <tr key={c.id_compra}>
              <td>{c.id_compra}</td>
              <td>{new Date(c.Fe_compra).toLocaleString()}</td>
              <td>{c.nombre_proveedor}</td>
              <td>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <Button
                    size="sm"
                    variant="outline-info"
                    onClick={() => obtenerDetalles(c.id_compra)}
                  >
                    🔍 Detalles
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-warning"
                    onClick={() => abrirModalEdicion(c)}
                  >
                    ✏️ Editar
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => abrirModalEliminacion(c)}
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <Pagination className="justify-content-center mt-3">
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
      )}
    </>
  );
};

export default TablaCompras;
