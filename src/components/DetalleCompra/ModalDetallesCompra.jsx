import { Modal, Table, Button } from "react-bootstrap";

const ModalDetallesCompra = ({ mostrarModal, setMostrarModal, detalles }) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {detalles.length === 0 ? (
          <p>No hay detalles para esta compra.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{d.nombre_producto}</td>
                  <td>{d.cantidad}</td>
                  <td>{d.precio_unitario}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesCompra;