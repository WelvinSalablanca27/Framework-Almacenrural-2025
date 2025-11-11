import { Modal, Button, Form } from "react-bootstrap";
import { FaPaw } from "react-icons/fa"; // Huella
import { GiCat } from "react-icons/gi"; // Gato

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  setNuevoProducto,
  agregarProducto,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setMostrarModal(false);
    setNuevoProducto({
      Nombre_Prod: "",
      Tipo_Prod: "",
      Existencia_Prod: "",
      stock: "",
      Precio_Costo: "",
      Precio_Venta: "",
      Fe_caducidad: "",
    });
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
      style={{ backgroundColor: "rgba(40, 167, 69, 0.05)" }}
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#2bb84cff",
          color: "white",
          borderTopLeftRadius: "0.375rem",
          borderTopRightRadius: "0.375rem",
        }}
      >
        <Modal.Title className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center gap-1">
            <GiCat color="#000000ff" size={24} />
            <FaPaw color="#ff0000ff" size={24} />
          </div>
          <span style={{ fontWeight: "bold" }}>Registrar Nuevo Producto</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{ backgroundColor: "#f8fff9", padding: "1.5rem" }}
      >
        <Form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                name="Nombre_Prod"
                value={nuevoProducto.Nombre_Prod}
                onChange={handleChange}
                placeholder="Ej: Arroz Premium"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                name="Tipo_Prod"
                value={nuevoProducto.Tipo_Prod}
                onChange={handleChange}
                placeholder="Ej: Grano, Lácteo, Bebida"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Existencia</Form.Label>
              <Form.Control
                type="number"
                name="Existencia_Prod"
                value={nuevoProducto.Existencia_Prod}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="col-md-6 mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={nuevoProducto.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Fecha de Caducidad</Form.Label>
              <Form.Control
                type="date"
                name="Fe_caducidad"
                value={nuevoProducto.Fe_caducidad}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <Form.Label>Precio Costo (C$)</Form.Label>
              <Form.Control
                type="number"
                name="Precio_Costo"
                value={nuevoProducto.Precio_Costo}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>Precio Venta (C$)</Form.Label>
              <Form.Control
                type="number"
                name="Precio_Venta"
                value={nuevoProducto.Precio_Venta}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer
        style={{
          backgroundColor: "#e9f7ef",
          borderBottomLeftRadius: "0.375rem",
          borderBottomRightRadius: "0.375rem",
        }}
      >
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="success"
          onClick={agregarProducto}
          style={{
            backgroundColor: "#218838",
            borderColor: "#1e7e34",
            fontWeight: "bold",
          }}
        >
          Guardar Producto
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;
