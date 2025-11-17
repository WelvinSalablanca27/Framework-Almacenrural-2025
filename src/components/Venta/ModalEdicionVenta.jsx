import { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from "react-select/async";

const ModalEdicionVenta = ({
  mostrar,
  setMostrar,
  venta,
  ventaEnEdicion,
  setVentaEnEdicion,
  detalles,
  setDetalles,
  clientes,
  productos,
  onSuccess
}) => {

  const [clienteSel, setClienteSel] = useState(null);
  const [productoSel, setProductoSel] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_Producto: "", Cantidad_Producto: "" });

  // ============ Cargar cliente al abrir ============
  useEffect(() => {
    if (venta && clientes.length > 0) {
      const cliente = clientes.find(c => c.id_Cliente === venta.id_Cliente);

      setClienteSel(cliente ? {
        value: cliente.id_Cliente,
        label: cliente.Nombre_Cliente        // ← CORREGIDO
      } : null);
    }
  }, [venta, clientes]);

  // ============ TOTAL =============
  const total = detalles?.reduce(
    (t, d) => t + (d.Cantidad_Producto * d.Precio_venta),
    0
  ) || 0;

  // ============ Cargar opciones clientes ============
  const cargarOpcionesClientes = (input, callback) => {
    const filtro = input.toLowerCase();

    const filtrados = clientes.filter(c =>
      (c.Nombre_Cliente || "").toLowerCase().includes(filtro)
    );

    callback(
      filtrados.map(c => ({
        value: c.id_Cliente,
        label: c.Nombre_Cliente            // ← AQUÍ EL NOMBRE REAL
      }))
    );
  };

  // ============ Cargar productos ============
  const cargarOpcionesProductos = (input, callback) => {
    const filtro = input.toLowerCase();

    const filtrados = productos.filter(p =>
      (p.Nombre_Producto || "").toLowerCase().includes(filtro)
    );

    callback(
      filtrados.map(p => ({
        value: p.id_Producto,
        label: p.Nombre_Producto,
        precio: p.Precio_venta,
        stock: p.stock
      }))
    );
  };

  // ============ Selección cliente ============
  const manejarCliente = (sel) => {
    setClienteSel(sel);
    setVentaEnEdicion(prev => ({
      ...prev,
      id_Cliente: sel ? sel.value : null
    }));
  };

  // ============ Selección producto ============
  const manejarProducto = (sel) => {
    setProductoSel(sel);
    setNuevoDetalle(prev => ({
      ...prev,
      id_Producto: sel ? sel.value : "",
      Precio_venta: sel ? sel.precio : 0
    }));
  };

  // ============ Agregar detalle ============
  const agregarDetalle = () => {
    if (!nuevoDetalle.id_Producto || nuevoDetalle.Cantidad_Producto <= 0) {
      alert("Selecciona un producto y cantidad válida.");
      return;
    }

    const prod = productos.find(p => p.id_Producto === nuevoDetalle.id_Producto);

    if (nuevoDetalle.Cantidad_Producto > prod.stock) {
      alert(`Stock insuficiente: ${prod.stock}`);
      return;
    }

    setDetalles(prev => [
      ...prev,
      {
        id_Producto: prod.id_Producto,
        nombre_producto: prod.Nombre_Producto,   // ← NOMBRE REAL
        Cantidad_Producto: parseInt(nuevoDetalle.Cantidad_Producto),
        Precio_venta: prod.Precio_venta
      }
    ]);

    setProductoSel(null);
    setNuevoDetalle({ id_Producto: "", Cantidad_Producto: "" });
  };


  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Editar Venta #{venta?.id_ventas}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>

          <Row>
            <Col md={6}>
              <Form.Label>Cliente</Form.Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarOpcionesClientes}  // ← CORREGIDO
                onChange={manejarCliente}
                value={clienteSel}
                placeholder="Buscar cliente..."
                isClearable
              />
            </Col>

            <Col md={6}>
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="text" readOnly value={ventaEnEdicion?.Fe_Venta} />
            </Col>
          </Row>

          <hr />

          <h5>Agregar Producto</h5>

          <Row>
            <Col md={6}>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarOpcionesProductos}
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
                onChange={e => setNuevoDetalle({
                  ...nuevoDetalle,
                  Cantidad_Producto: e.target.value
                })}
              />
            </Col>

            <Col md={3}>
              <Button variant="success" onClick={agregarDetalle} style={{ width: "100%" }}>
                Agregar
              </Button>
            </Col>
          </Row>

          {detalles.length > 0 && (
            <Table striped bordered className="mt-3">
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
                    <td>C$ {(d.Cantidad_Producto * d.Precio_venta).toFixed(2)}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => {
                        setDetalles(prev => prev.filter((_, X) => X !== i))
                      }}>X</Button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                  <td colSpan={2}><strong>C$ {total.toFixed(2)}</strong></td>
                </tr>
              </tfoot>

            </Table>
          )}

        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>Cancelar</Button>
        <Button variant="primary" onClick={() => onSuccess(ventaEnEdicion)}>
          Actualizar Venta
        </Button>
      </Modal.Footer>

    </Modal>
  );
};

export default ModalEdicionVenta;
