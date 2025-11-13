import { useState } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl,
} from "react-bootstrap";
import AsyncSelect from "react-select/async";

const ModalRegistrarVenta = ({
  mostrarModal,
  setMostrarModal,
  nuevaVenta,
  setNuevaVenta,
  detalles,
  setDetalles,
  clientes,
  productos,
  agregarVenta,
  hoy,
}) => {
  const [clienteSel, setClienteSel] = useState(null);
  const [productoSel, setProductoSel] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_Producto: "",
    Cantidad_Producto: "",
    Precio_venta: 0,
  });

  const total =
    detalles?.reduce(
      (s, d) => s + (d.Cantidad_Producto || 0) * (d.Precio_venta || 0),
      0
    ) || 0;

  // Función para filtrar opciones en AsyncSelect
 const cargarOpciones = (lista = [], campo) => (input, callback) => {
  const filtrados = lista.filter(
    (item) => (item[campo] || "").toLowerCase().includes(input.toLowerCase())
  );

  callback(
    filtrados.map((item) => ({
      value: item.id_Cliente ?? item.id_Producto ?? null,
      label: item[campo] ?? item.nombre_producto ?? "Sin nombre",
      precio: item.Precio_venta ?? item.precio_unitario ?? 0,
      stock: item.stock ?? 0,
    }))
  );
};


  const manejarCliente = (sel) => {
    setClienteSel(sel);
    setNuevaVenta((prev) => ({ ...prev, id_Cliente: sel ? sel.value : "" }));
  };

  const manejarProducto = (sel) => {
    setProductoSel(sel);
    setNuevoDetalle((prev) => ({
      ...prev,
      id_Producto: sel ? sel.value : "",
      Precio_venta: sel ? sel.precio : 0,
    }));
  };

  const agregarDetalle = () => {
    if (
      !nuevoDetalle.id_Producto ||
      !nuevoDetalle.Cantidad_Producto ||
      nuevoDetalle.Cantidad_Producto <= 0
    ) {
      alert("Selecciona un producto y una cantidad válida.");
      return;
    }

    const prod = productos.find(
      (p) => p.id_Producto === parseInt(nuevoDetalle.id_Producto)
    );
    if (nuevoDetalle.Cantidad_Producto > prod.stock) {
      alert(`Stock insuficiente: ${prod.stock}`);
      return;
    }

    setDetalles((prev) => [
      ...prev,
      {
        id_Producto: parseInt(nuevoDetalle.id_Producto),
        nombre_producto: prod.nombre_producto,
        Cantidad_Producto: parseInt(nuevoDetalle.Cantidad_Producto),
        Precio_venta: parseFloat(nuevoDetalle.Precio_venta),
      },
    ]);

    setNuevoDetalle({
      id_Producto: "",
      Cantidad_Producto: "",
      Precio_venta: 0,
    });
    setProductoSel(null);
  };

  return (
    <Modal
      backdrop="static"
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Nueva Venta</Modal.Title>
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
                  loadOptions={cargarOpciones(clientes, "primer_nombre")}
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
                  value={nuevaVenta.Fe_Venta || hoy}
                  onChange={(e) =>
                    setNuevaVenta((prev) => ({
                      ...prev,
                      Fe_Venta: e.target.value,
                    }))
                  }
                  max={hoy}
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
                loadOptions={cargarOpciones(productos, "nombre_producto")}
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
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((d, i) => (
                  <tr key={i}>
                    <td>{d.nombre_producto}</td>
                    <td>{d.Cantidad_Producto}</td>
                    <td>C$ {d.Precio_venta.toFixed(2)}</td>
                    <td>
                      C$ {(d.Cantidad_Producto * d.Precio_venta).toFixed(2)}
                    </td>
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
                ))}
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
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarVenta}
          disabled={!nuevaVenta.id_Cliente || detalles.length === 0}
        >
          Guardar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistrarVenta;
