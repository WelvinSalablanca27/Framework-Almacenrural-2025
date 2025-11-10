// components/Producto/ModalEdicionProducto.jsx
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrar,
  setMostrar,
  productoEditado,
  setProductoEditado,
  guardarEdicion,
}) => {
  const [fechaLocal, setFechaLocal] = useState("");

  useEffect(() => {
    if (productoEditado?.Fe_caducidad) {
      const fecha = new Date(productoEditado.Fe_caducidad);
      const offset = fecha.getTimezoneOffset() * 60000;
      const fechaCorregida = new Date(fecha.getTime() + offset);
      setFechaLocal(fechaCorregida.toISOString().split("T")[0]);
    }
  }, [productoEditado?.Fe_caducidad]);

  const manejarCambioFecha = (e) => {
    const fechaInput = e.target.value;
    if (!fechaInput) {
      setProductoEditado((prev) => ({ ...prev, Fe_caducidad: "" }));
      return;
    }
    const fechaCorregida = new Date(fechaInput + "T12:00:00");
    setProductoEditado((prev) => ({
      ...prev,
      Fe_caducidad: fechaCorregida.toISOString(),
    }));
    setFechaLocal(fechaInput);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({ ...prev, [name]: value }));
  };

  const cerrar = () => {
    setMostrar(false);
    setProductoEditado(null);
  };

  return (
    <Modal show={mostrar} onHide={cerrar} centered>
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {productoEditado && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="Nombre_Prod"
                value={productoEditado.Nombre_Prod}
                onChange={manejarCambio}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                name="Tipo_Prod"
                value={productoEditado.Tipo_Prod}
                onChange={manejarCambio}
              >
                <option value="Alimento">Alimento</option>
                <option value="Medicamento">Medicamento</option>
                <option value="Aseo">Aseo</option>
                <option value="Accesorio">Accesorio</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Existencia</Form.Label>
              <Form.Control
                type="number"
                name="Existencia_Prod"
                value={productoEditado.Existencia_Prod}
                onChange={manejarCambio}
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio Costo</Form.Label>
              <Form.Control
                type="number"
                name="Precio_Costo"
                value={productoEditado.Precio_Costo}
                onChange={manejarCambio}
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio Venta</Form.Label>
              <Form.Control
                type="number"
                name="Precio_Venta"
                value={productoEditado.Precio_Venta}
                onChange={manejarCambio}
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Caducidad</Form.Label>
              <Form.Control
                type="date"
                value={fechaLocal}
                onChange={manejarCambioFecha}
                min={new Date().toISOString().split("T")[0]}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cerrar}>
          Cancelar
        </Button>
        <Button variant="warning" onClick={guardarEdicion}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;