import { Modal, Table, Button } from 'react-bootstrap';

const ModalDetallesVenta = ({ mostrarModal, setMostrarModal, detalles }) => {
  // Aseguramos que detalles sea un array
  const detallesSeguros = Array.isArray(detalles) ? detalles : [];

  // Cálculo del total
  const total = detallesSeguros.reduce(
    (acc, d) => acc + (d.Cantidad_Producto ?? 0) * (d.Precio_venta ?? 0),
    0
  );

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detallesSeguros.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">No hay detalles</td>
              </tr>
            ) : (
              detallesSeguros.map((d) => (
                <tr key={d.id_DetalleVenta}>
                  <td>{d.nombre_producto}</td>
                  <td>{d.Cantidad_Producto}</td>
                  <td>C$ {parseFloat(d.Precio_venta).toFixed(2)}</td>
                  <td>C$ {(d.Cantidad_Producto * d.Precio_venta).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
          {detallesSeguros.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={3} className="text-end fw-bold">Total:</td>
                <td className="fw-bold text-danger">C$ {total.toFixed(2)}</td>
              </tr>
            </tfoot>
          )}
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesVenta;
