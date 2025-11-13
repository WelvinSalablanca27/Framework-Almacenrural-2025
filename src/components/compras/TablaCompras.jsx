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
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Cargando compras...</p>
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <p className="text-center text-muted py-5">
        No hay compras registradas.
      </p>
    );
  }

  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

  const handlePagina = (numero) => {
    if (numero < 1) numero = 1;
    if (numero > totalPaginas) numero = totalPaginas;
    establecerPaginaActual(numero);
  };

  // Generar números de página visibles (máx. 5)
  const generarPaginacion = () => {
    const paginas = [];
    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, paginaActual + 2);

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  };

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
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((c) => (
            <tr key={c.id_compra}>
              <td>{c.id_compra}</td>
              <td>{c.nombre_proveedor}</td>
              <td>{new Date(c.Fe_compra).toLocaleString()}</td>
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
        <Pagination className="justify-content-center mt-3 flex-wrap">
          <Pagination.First onClick={() => handlePagina(1)} disabled={paginaActual === 1} />
          <Pagination.Prev onClick={() => handlePagina(paginaActual - 1)} disabled={paginaActual === 1} />

          {generarPaginacion().map((num) => (
            <Pagination.Item
              key={num}
              active={num === paginaActual}
              onClick={() => handlePagina(num)}
            >
              {num}
            </Pagination.Item>
          ))}

          <Pagination.Next onClick={() => handlePagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
          <Pagination.Last onClick={() => handlePagina(totalPaginas)} disabled={paginaActual === totalPaginas} />
        </Pagination>
      )}
    </>
  );
};

export default TablaCompras;