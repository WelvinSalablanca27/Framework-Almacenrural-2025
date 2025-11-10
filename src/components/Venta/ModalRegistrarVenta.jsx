import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroVenta = ({
  mostrarModal,
  setMostrarModal,
  nuevaVenta,
  manejarCambioInput,
  agregarVenta,
}) => {
  return (
    <Modal  backdrop = "static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      
      
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="id_cliente">
            <Form.Label>ID del cliente</Form.Label>
            <Form.Control
              type="text"
              name="id_cliente"
              value={nuevaVenta.id_cliente}
              onChange={manejarCambioInput}
              placeholder="Ej: 12"
              maxLength={4}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="Fe_venta">
            <Form.Label>fecha_venta</Form.Label>
            <Form.Control
              type="date"
              name="Fe_venta"
              value={nuevaVenta.Fe_venta}
              onChange={manejarCambioInput}
              placeholder="Ej: 25-12-2023"
              maxLength={20}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarVenta}
          disabled={!nuevaVenta.id_cliente.trim()}

          
        >
          Guardar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroVenta;