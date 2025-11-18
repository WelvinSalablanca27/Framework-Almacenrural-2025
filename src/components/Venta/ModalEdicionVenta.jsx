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
  clientes,
  productos,
  actualizarVenta,
}) => {
  const [clienteSel, setClienteSel] = useState(null);
  const [productoSel, setProductoSel] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_Producto: "",
    Cantidad_Producto: "",
    Precio_venta: 0,
  });

  const total =
    detalles?.reduce((s, d) => s + d.Cantidad_Producto * d.Precio_venta, 0) || 0;

  // ================== CARGAR CLIENTE ==================
  useEffect(() => {
    if (ventaEnEdicion && clientes.length > 0) {
      const cliente = clientes.find(c => c.id_Cliente === ventaEnEdicion.id_Cliente);

      if (cliente) {
        setClienteSel({
          value: cliente.id_Cliente,
          label: `${cliente.Nombre1} ${cliente.Nombre2} ${cliente.Apellido1} ${cliente.Apellido2}`,
        });
      }
    }
  }, [ventaEnEdicion, clientes]);

  // ================== BUSCAR CLIENTES ==================
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

// ================== BUSCAR PRODUCTOS ==================
const cargarProductos = (inputValue, callback) => {
  const texto = inputValue?.toLowerCase() || "";
  const filtrados = productos.filter((p) =>
    p.Nombre_Prod.toLowerCase().includes(texto)
  );

  callback(
    filtrados.map((p) => ({
      value: p.id_Producto,
      label: `${p.Nombre_Prod} (Stock: ${p.stock})`,
      precio: p.Precio_Venta,
      stock: p.stock,
      productoCompleto: p,
    }))
  );
};


  // ================== MANEJAR CAMBIOS ==================
  const manejarCliente = sel => {
    setClienteSel(sel);
    setVentaEnEdicion(prev => ({
      ...prev,
      id_Cliente: sel ? sel.value : "",
    }));
  };

  const manejarProducto = sel => {
    setProductoSel(sel);
    setNuevoDetalle(prev => ({
      ...prev,
      id_Producto: sel ? sel.value : "",
      Precio_venta: sel ? sel.precio : 0,
    }));
  };

  // ================== AGREGAR DETALLE ==================
  const agregarDetalle = () => {
    if (!nuevoDetalle.id_Producto || !nuevoDetalle.Cantidad_Producto) {
      alert("Selecciona un producto y una cantidad válida.");
      return;
    }

    const prod = productos.find(
      p => p.id_Producto === parseInt(nuevoDetalle.id_Producto)
    );

    if (!prod) {
      alert("Producto no encontrado.");
      return;
    }

    if (nuevoDetalle.Cantidad_Producto > prod.stock) {
      alert(`Stock insuficiente: ${prod.stock}`);
      return;
    }

    setDetalles(prev => [
      ...prev,
      {
        id_Producto: prod.id_Producto,
        nombre_producto: prod.Nombre_Prod,
        Cantidad_Producto: parseInt(nuevoDetalle.Cantidad_Producto),
        Precio_venta: parseFloat(prod.Precio_Venta),
      },
    ]);

    setNuevoDetalle({ id_Producto: "", Cantidad_Producto: "", Precio_venta: 0 });
    setProductoSel(null);
  };

  return (
    <Modal
      backdrop="static"
      show={mostrar}
      onHide={() => setMostrar(false)}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
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
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setVentaEnEdicion((prev) => ({
                      ...prev,
                      Fe_Venta: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Agregar Producto</h5>

          <Row className="align-items-end">
            <Col md={5}>
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
                placeholder="Cantidad"
                min="1"
                value={nuevoDetalle.Cantidad_Producto}
                onChange={(e) =>
                  setNuevoDetalle((prev) => ({
                    ...prev,
                    Cantidad_Producto: e.target.value,
                  }))
                }
              />
            </Col>

            <Col md={4}>
              <Button
                variant="success"
                onClick={agregarDetalle}
                style={{ width: "100%" }}
              >
                Agregar
              </Button>
            </Col>
          </Row>

          {detalles?.length > 0 && (
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {detalles.map((d, i) => {
                  const cantidad = Number(d.Cantidad_Producto) || 0;
                  const precio = Number(d.Precio_venta) || 0;

                  return (
                    <tr key={i}>
                      <td>{d.nombre_producto}</td>
                      <td>{cantidad}</td>
                      <td>C$ {precio.toFixed(2)}</td>
                      <td>C$ {(cantidad * precio).toFixed(2)}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            setDetalles((prev) =>
                              prev.filter((_, idx) => idx !== i)
                            )
                          }
                        >
                          X
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end">
                    <strong>Total:</strong>
                  </td>
                  <td colSpan={2}>
                    <strong>C$ {total.toFixed(2)}</strong>
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
          onClick={actualizarVenta}
          disabled={!ventaEnEdicion?.id_Cliente || detalles.length === 0}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionVenta;
