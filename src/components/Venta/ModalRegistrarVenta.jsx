import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Table,
  Row,
  Col,
  FormControl,
} from "react-bootstrap";
import AsyncSelect from "react-select/async";

const ModalRegistroVenta = ({
  mostrar,
  setMostrar,
  clientes = [],
  productos = [],
  onGuardarVenta, // función que recibe { venta: {...}, detalles: [...] }
}) => {
  const [clienteSel, setClienteSel] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [productoSel, setProductoSel] = useState(null);
  const [cantidad, setCantidad] = useState("");

  // Calcular total
  const total = detalles.reduce(
    (sum, d) => sum + (d.Precio_venta || 0) * (d.Cantidad_Producto || 0),
    0
  );

  // ==================== OPCIONES CLIENTES ====================
  const cargarClientes = (inputValue, callback) => {
    const texto = inputValue?.toLowerCase() || "";
    const filtrados = clientes.filter((c) =>
      `${c.Nombre1} ${c.Apellido1}`.toLowerCase().includes(texto)
    );

    callback(
      filtrados.map((c) => ({
        value: c.id_Cliente,
        label: `${c.Nombre1} ${c.Nombre2 || ""} ${c.Apellido1} ${
          c.Apellido2 || ""
        }`.trim(),
      }))
    );
  };

  // ==================== OPCIONES PRODUCTOS ====================
  const cargarProductos = (inputValue, callback) => {
    const texto = inputValue?.toLowerCase() || "";
    const filtrados = productos.filter(p =>
      p.Nombre_Prod.toLowerCase().includes(texto)
    );

    callback(
      filtrados.map(p => ({
        value: p.id_Producto,
        label: `${p.Nombre_Prod} (Stock: ${p.stock})`,
        precio: p.Precio_Venta,
        stock: p.stock,
        productoCompleto: p,
      }))
    );
  };

  // ==================== AGREGAR DETALLE ====================
  const agregarDetalle = () => {
    if (!productoSel || !cantidad || cantidad <= 0) {
      alert("Selecciona un producto y una cantidad válida.");
      return;
    }

    const cant = parseInt(cantidad);
    const prod = productoSel.productoCompleto;

    if (cant > prod.stock) {
      alert(`Stock insuficiente. Disponible: ${prod.stock}`);
      return;
    }

    setDetalles(prev => [
      ...prev,
      {
        id_Producto: prod.id_Producto,
        nombre_producto: prod.Nombre_Prod,
        Cantidad_Producto: cant,
        Precio_venta: parseFloat(prod.Precio_Venta),
      },
    ]);

    setProductoSel(null);
    setCantidad("");
  };

  // ==================== GUARDAR VENTA ====================
  const guardarVenta = () => {
    if (!clienteSel) {
      alert("Debes seleccionar un cliente.");
      return;
    }

    if (detalles.length === 0) {
      alert("Debes agregar al menos un producto.");
      return;
    }

    const venta = {
      id_Cliente: clienteSel.value,
      // Fe_Venta se genera automáticamente en backend
    };

    const detallesParaEnviar = detalles.map(d => ({
      id_Producto: d.id_Producto,
      Cantidad_Producto: d.Cantidad_Producto,
      Precio_venta: d.Precio_venta,
    }));

    onGuardarVenta({ venta, detalles: detallesParaEnviar });
    setMostrar(false);
  };

  // ==================== LIMPIAR ESTADO ====================
  useEffect(() => {
    if (!mostrar) {
      setClienteSel(null);
      setDetalles([]);
      setProductoSel(null);
      setCantidad("");
    }
  }, [mostrar]);

  return (
    <Modal
      backdrop="static"
      show={mostrar}
      onHide={() => setMostrar(false)}
      size="xl"
      fullscreen="lg-down"
      centered
    >
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
                <Form.Control
                  type="text"
                  value={new Date().toLocaleString()}
                  disabled
                />
                <Form.Text>Se registra automáticamente al guardar</Form.Text>
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
                onChange={e => setCantidad(e.target.value)}
                placeholder="Cant."
                onKeyDown={e => e.key === "Enter" && agregarDetalle()}
              />
            </Col>

            <Col md={3}>
              <Button
                variant="success"
                onClick={agregarDetalle}
                style={{ width: "100%" }}
              >
                Agregar
              </Button>
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
                {detalles.map((d, i) => {
                  const cant = d.Cantidad_Producto || 0;
                  const precio = d.Precio_venta || 0;
                  return (
                    <tr key={i}>
                      <td>{d.nombre_producto}</td>
                      <td>{cant}</td>
                      <td>C$ {precio.toFixed(2)}</td>
                      <td>C$ {(cant * precio).toFixed(2)}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            setDetalles(prev => prev.filter((_, idx) => idx !== i))
                          }
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end fw-bold">
                    Total:
                  </td>
                  <td colSpan={2} className="fw-bold">
                    C$ {total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarVenta}
          disabled={!clienteSel || detalles.length === 0}
        >
          Guardar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroVenta;
