import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejarCambioInput,
  agregarProducto,
}) => {
  return (
    <Modal backdrop="static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="Nombre_Prod">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="Nombre_Prod"
              value={nuevoProducto.Nombre_Prod}
              onChange={manejarCambioInput}
              placeholder="Ej: Leche Entera"
              maxLength={30}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="Tipo_Prod">
            <Form.Label>Tipo de Producto</Form.Label>
            <Form.Control
              type="text"
              name="Tipo_Prod"
              value={nuevoProducto.Tipo_Prod}
              onChange={manejarCambioInput}
              placeholder="Ej: Lácteo"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="Existencia_Prod">
            <Form.Label>Existencia</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="Existencia_Prod"
              value={nuevoProducto.Existencia_Prod}
              onChange={manejarCambioInput}
              placeholder="Ej: 100.00"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="Precio_Costo">
            <Form.Label>Precio de Costo</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="Precio_Costo"
              value={nuevoProducto.Precio_Costo}
              onChange={manejarCambioInput}
              placeholder="Ej: 15.50"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="Precio_Venta">
            <Form.Label>Precio de Venta</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="Precio_Venta"
              value={nuevoProducto.Precio_Venta}
              onChange={manejarCambioInput}
              placeholder="Ej: 20.00"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="Fe_caducidad">
            <Form.Label>Fecha de Caducidad</Form.Label>
            <Form.Control
              type="date"
              name="Fe_caducidad"
              value={nuevoProducto.Fe_caducidad}
              onChange={manejarCambioInput}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarProducto}>
          Guardar Producto
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;
