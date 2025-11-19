import { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from "react-select/async";

const ModalRegistroVenta = ({ mostrar, setMostrar, clientes = [], productos = [], onGuardarVenta }) => {
  const [clienteSel, setClienteSel] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [productoSel, setProductoSel] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [fechaVenta, setFechaVenta] = useState(new Date().toISOString().split("T")[0]);

  const total = detalles.reduce((sum, d) => sum + Number(d.Precio_venta) * Number(d.Cantidad_Producto), 0);

  const cargarClientes = (inputValue, callback) => {
    const texto = (inputValue || "").toLowerCase();
    const filtrados = clientes.filter((c) =>
      `${c.Nombre1 || ""} ${c.Apellido1 || ""}`.toLowerCase().includes(texto)
    );
    callback(
      filtrados.map((c) => ({
        value: c.id_Cliente,
        label: `${c.Nombre1 || ""} ${c.Nombre2 || ""} ${c.Apellido1 || ""} ${c.Apellido2 || ""}`.trim(),
      }))
    );
  };

  const cargarProductos = (inputValue, callback) => {
    const texto = (inputValue || "").toLowerCase();
    const filtrados = productos.filter((p) =>
      (p.Nombre_Prod || p.Nombre_Producto || "").toLowerCase().includes(texto)
    );
    callback(
      filtrados.map((p) => ({
        value: p.id_Producto,
        label: p.Nombre_Prod || p.Nombre_Producto,
        precio: Number(p.Precio_Venta ?? p.Precio ?? 0),
        productoCompleto: p,
      }))
    );
  };

  const agregarDetalle = () => {
    if (!productoSel || !cantidad || Number(cantidad) <= 0) {
      alert("Selecciona un producto y cantidad válida.");
      return;
    }
    const prod = productoSel.productoCompleto;
    if (detalles.some((d) => d.id_Producto === prod.id_Producto)) {
      alert("Este producto ya está agregado.");
      return;
    }
    setDetalles((prev) => [
      ...prev,
      {
        id_Producto: prod.id_Producto,
        nombre_producto: prod.Nombre_Prod || prod.Nombre_Producto || "Producto",
        Cantidad_Producto: Number(cantidad),
        Precio_venta: Number(productoSel.precio ?? prod.Precio_Venta ?? prod.Precio ?? 0),
      },
    ]);
    setProductoSel(null);
    setCantidad("");
  };

  const eliminarDetalle = (index) => setDetalles((prev) => prev.filter((_, i) => i !== index));

  const guardarVenta = () => {
    if (!clienteSel) return alert("Debes seleccionar un cliente.");
    if (detalles.length === 0) return alert("Debes agregar al menos un producto.");

    const venta = { id_Cliente: clienteSel.value, Fe_Venta: fechaVenta };
    if (typeof onGuardarVenta === "function") onGuardarVenta({ venta, detalles });

    // Limpiar modal
    setClienteSel(null);
    setDetalles([]);
    setProductoSel(null);
    setCantidad("");
    setFechaVenta(new Date().toISOString().split("T")[0]);
    setMostrar(false);
  };

  useEffect(() => {
    if (!mostrar) {
      setClienteSel(null);
      setDetalles([]);
      setProductoSel(null);
      setCantidad("");
      setFechaVenta(new Date().toISOString().split("T")[0]);
    }
  }, [mostrar]);

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} size="xl" fullscreen="lg-down" centered>
      <Modal.Header closeButton>
        <Modal.Title>Nueva Venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Cliente</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarClientes}
                  onChange={setClienteSel}
                  value={clienteSel}
                  placeholder="Buscar cliente..."
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha de Venta</Form.Label>
                <Form.Control type="date" value={fechaVenta} onChange={(e) => setFechaVenta(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Agregar Productos</h5>
          <Row className="align-items-end mb-3">
            <Col md={6}>
              <Form.Label>Producto</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarProductos}
                onChange={setProductoSel}
                value={productoSel}
                placeholder="Buscar producto..."
                isClearable
              />
            </Col>
            <Col md={3}>
              <Form.Label>Cantidad</Form.Label>
              <FormControl
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Cant."
              />
            </Col>
            <Col md={3}>
              <Button variant="success" onClick={agregarDetalle} style={{ width: "100%" }}>Agregar</Button>
            </Col>
          </Row>

          {detalles.length > 0 && (
            <Table striped bordered hover responsive className="mt-3">
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((d, i) => (
                  <tr key={i}>
                    <td>{d.nombre_producto}</td>
                    <td>{d.Cantidad_Producto}</td>
                    <td>C$ {Number(d.Precio_venta).toFixed(2)}</td>
                    <td>C$ {(Number(d.Cantidad_Producto) * Number(d.Precio_venta)).toFixed(2)}</td>
                    <td><Button size="sm" variant="danger" onClick={() => eliminarDetalle(i)}>Eliminar</Button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end fw-bold">Total:</td>
                  <td colSpan={2} className="fw-bold">C$ {total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </Table>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>Cancelar</Button>
        <Button variant="primary" onClick={guardarVenta} disabled={!clienteSel || detalles.length === 0}>Guardar Venta</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroVenta;
