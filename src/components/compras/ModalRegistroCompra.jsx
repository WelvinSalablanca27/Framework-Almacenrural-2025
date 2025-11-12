import { useState } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";

const ModalRegistroCompra = ({ mostrar, setMostrar, detalles, setDetalles, productos, agregarCompra }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  const agregarDetalle = () => {
    if (!productoSeleccionado || cantidad <= 0 || precio <= 0) return;

    const prod = productos.find(p => p.id_producto === parseInt(productoSeleccionado));
    if (!prod) return;

    setDetalles([
      ...detalles,
      {
        id_Producto: prod.id_producto,
        nombre_producto: prod.nombre_producto,
        Cantidad: parseInt(cantidad),
        Precio: parseFloat(precio)
      }
    ]);

    setProductoSeleccionado("");
    setCantidad("");
    setPrecio("");
  };

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nueva Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-2">
          <Col>
            {productos.length > 0 ? (
              <Form.Select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombre_producto}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <Form.Select disabled>
                <option>No hay productos disponibles</option>
              </Form.Select>
            )}
          </Col>
          <Col>
            <Form.Control
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </Col>
          <Col>
            <Button variant="success" onClick={agregarDetalle} disabled={productos.length === 0}>
              Agregar
            </Button>
          </Col>
        </Row>

        {detalles.length > 0 && (
          <Table striped bordered hover size="sm" className="mt-3">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d, index) => (
                <tr key={index}>
                  <td>{d.nombre_producto}</td>
                  <td>{d.Cantidad}</td>
                  <td>{d.Precio}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>Cerrar</Button>
        <Button variant="primary" onClick={agregarCompra} disabled={detalles.length === 0}>
          Guardar Compra
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCompra;