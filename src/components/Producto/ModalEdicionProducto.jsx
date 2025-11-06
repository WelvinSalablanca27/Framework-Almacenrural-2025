import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrar,
  setMostrar,
  productoEditado,
  setProductoEditado,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="Nombre_Prod">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="Nombre_Prod"
              value={productoEditado?.Nombre_Prod}
              onChange={manejarCambio}
              placeholder="Ej: Leche Entera"
              maxLength={30}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="Tipo_Prod">
            <Form.Label>Tipo de Producto</Form.Label>
            <Form.Control
              type="text"
              name="Tipo_Prod"
              value={productoEditado?.Tipo_Prod}
              onChange={manejarCambio}
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
              value={productoEditado?.Existencia_Prod}
              onChange={manejarCambio}
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
              value={productoEditado?.Precio_Costo}
              onChange={manejarCambio}
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
              value={productoEditado?.Precio_Venta}
              onChange={manejarCambio}
              placeholder="Ej: 20.00"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="Fe_caducidad">
            <Form.Label>Fecha de Caducidad</Form.Label>
            <Form.Control
              type="date"
              name="Fe_caducidad"
              value={productoEditado?.Fe_caducidad}
              onChange={manejarCambio}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!productoEditado?.Nombre_Prod?.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;
