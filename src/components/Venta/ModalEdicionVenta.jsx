import { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from "react-select/async";

const ModalEdicionVenta = ({
  mostrar,
  setMostrar,
  ventaEnEdicion,
  setVentaEnEdicion,
  detalles,
  setDetalles,
  clientes = [],
  productos = [],
  onActualizarVenta, // función que actualiza la venta
}) => {
  const [clienteSel, setClienteSel] = useState(null);
  const [productoSel, setProductoSel] = useState(null);
  const [cantidad, setCantidad] = useState("");

  const total = detalles.reduce(
    (sum, d) => sum + Number(d.Precio_venta) * Number(d.Cantidad_Producto),
    0
  );

  // Inicializar cliente al abrir modal
  useEffect(() => {
    if (ventaEnEdicion && clientes.length > 0) {
      const cliente = clientes.find(c => c.id_Cliente === ventaEnEdicion.id_Cliente);
      if (cliente) {
        setClienteSel({
          value: cliente.id_Cliente,
          label: `${cliente.Nombre1} ${cliente.Nombre2 || ""} ${cliente.Apellido1} ${cliente.Apellido2 || ""}`.trim(),
        });
      }
    }
  }, [ventaEnEdicion, clientes]);

  // Cargar clientes para AsyncSelect
  const cargarClientes = (inputValue, callback) => {
    const texto = inputValue?.toLowerCase() || "";
    const filtrados = clientes.filter(c =>
      `${c.Nombre1} ${c.Apellido1}`.toLowerCase().includes(texto)
    );
    callback(
      filtrados.map(c => ({
        value: c.id_Cliente,
        label: `${c.Nombre1} ${c.Nombre2 || ""} ${c.Apellido1} ${c.Apellido2 || ""}`.trim(),
      }))
    );
  };

  // Cargar productos para AsyncSelect
  const cargarProductos = (inputValue, callback) => {
    const texto = inputValue?.toLowerCase() || "";
    const filtrados = productos.filter(p =>
      (p.Nombre_Prod || p.Nombre_Producto || "").toLowerCase().includes(texto)
    );
    callback(
      filtrados.map(p => ({
        value: p.id_Producto,
        label: p.Nombre_Prod || p.Nombre_Producto,
        precio: Number(p.Precio_Venta ?? p.Precio ?? 0),
        productoCompleto: p,
      }))
    );
  };

  const manejarCliente = sel => {
    setClienteSel(sel);
    setVentaEnEdicion(prev => ({
      ...prev,
      id_Cliente: sel ? sel.value : null,
    }));
  };

  const manejarProducto = sel => {
    setProductoSel(sel);
    setCantidad("");
  };

  const agregarDetalle = () => {
    if (!productoSel || !cantidad || Number(cantidad) <= 0) {
      alert("Selecciona un producto y una cantidad válida.");
      return;
    }

    const prod = productoSel.productoCompleto;

    // Evitar duplicados
    if (detalles.some(d => d.id_Producto === prod.id_Producto)) {
      alert("Este producto ya está agregado.");
      return;
    }

    setDetalles(prev => [
      ...prev,
      {
        id_Producto: prod.id_Producto,
        nombre_producto: prod.Nombre_Prod || prod.Nombre_Producto,
        Cantidad_Producto: Number(cantidad),
        Precio_venta: Number(productoSel.precio ?? prod.Precio_Venta ?? prod.Precio ?? 0),
      },
    ]);

    setProductoSel(null);
    setCantidad("");
  };

  // Función segura de actualizar venta
  const manejarActualizarVenta = () => {
    if (!ventaEnEdicion || !clienteSel) {
      alert("Debes seleccionar un cliente.");
      return;
    }

    if (!detalles || detalles.length === 0) {
      alert("Debes agregar al menos un producto.");
      return;
    }

    const ventaActualizada = {
      ...ventaEnEdicion,
      id_Cliente: clienteSel.value,
      detalles,
    };

    if (typeof onActualizarVenta === "function") {
      onActualizarVenta(ventaActualizada);
    }

    // Limpiar modal
    setClienteSel(null);
    setDetalles([]);
    setProductoSel(null);
    setCantidad("");
    setMostrar(false);
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Venta #{ventaEnEdicion?.id_ventas}</Modal.Title>
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
                  onChange={manejarCliente}
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
                  type="date"
                  value={ventaEnEdicion?.Fe_Venta?.split("T")[0] || ""}
                  onChange={e => setVentaEnEdicion(prev => ({ ...prev, Fe_Venta: e.target.value }))}
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Agregar Productos</h5>
          <Row className="align-items-end mb-3">
            <Col md={6}>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarProductos}
                onChange={manejarProducto}
                value={productoSel}
                placeholder="Buscar producto..."
                isClearable
              />
            </Col>
            <Col md={3}>
              <FormControl
                type="number"
                min="1"
                value={cantidad}
                onChange={e => setCantidad(e.target.value)}
                placeholder="Cantidad"
              />
            </Col>
            <Col md={3}>
              <Button variant="success" onClick={agregarDetalle} style={{ width: "100%" }}>
                Agregar
              </Button>
            </Col>
          </Row>

          {detalles.length > 0 && (
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
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
                    <td>C$ {(d.Cantidad_Producto * d.Precio_venta).toFixed(2)}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDetalles(prev => prev.filter((_, idx) => idx !== i))}
                      >
                        Eliminar
                      </Button>
                    </td>
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
        <Button
          variant="primary"
          onClick={manejarActualizarVenta}
          disabled={!clienteSel || detalles.length === 0}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionVenta;
