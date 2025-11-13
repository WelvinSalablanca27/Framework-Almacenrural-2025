import { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from 'react-select/async';

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
  actualizarVenta
}) => {
  const [clienteSel, setClienteSel] = useState(null);
  const [productoSel, setProductoSel] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_Producto: '', Cantidad_Producto: '' });

  // === Cargar cliente al abrir ===
  useEffect(() => {
    if (venta && clientes?.length > 0 && ventaEnEdicion) {
      const cliente = clientes.find(c => c.id_Cliente === ventaEnEdicion.id_Cliente);
      setClienteSel(cliente ? {
        value: cliente.id_Cliente,
        label: `${cliente.primer_nombre} ${cliente.primer_apellido}`
      } : null);
    }
  }, [venta, clientes, ventaEnEdicion]);

  // === Cálculo del total ===
const total = detalles?.reduce(
  (s, d) => s + ((d.Cantidad_Producto || 0) * (d.Precio_venta || 0)),
  0
) || 0;

  // === Cargar opciones para AsyncSelect ===
  const cargarOpciones = (lista = [], campo) => (input, callback) => {
    const filtro = (input || '').toLowerCase();
    const filtrados = lista.filter(item => item[campo]?.toLowerCase().includes(filtro));
    callback(filtrados.map(item => ({
      value: item.id_Producto,
      label: item.nombre_producto,
      precio: item.Precio_venta,
      stock: item.stock
    })));
  };

  // === Manejar selección ===
  const manejarCliente = sel => {
    setClienteSel(sel);
    setVentaEnEdicion(prev => ({ ...prev, id_Cliente: sel ? sel.value : null }));
  };

  const manejarProducto = sel => {
    setProductoSel(sel);
    setNuevoDetalle(prev => ({
      ...prev,
      id_Producto: sel ? sel.value : '',
      Precio_venta: sel ? sel.precio : 0
    }));
  };

  const agregarDetalle = () => {
    if (!nuevoDetalle.id_Producto || !nuevoDetalle.Cantidad_Producto || nuevoDetalle.Cantidad_Producto <= 0) {
      alert("Selecciona producto y cantidad válida.");
      return;
    }

    const prod = productos.find(p => p.id_Producto === parseInt(nuevoDetalle.id_Producto));
    if (!prod) return;

    if (nuevoDetalle.Cantidad_Producto > prod.stock) {
      alert(`Stock insuficiente: ${prod.stock}`);
      return;
    }

    setDetalles(prev => [...prev, {
      id_Producto: parseInt(nuevoDetalle.id_Producto),
      nombre_producto: prod.nombre_producto,
      Cantidad_Producto: parseInt(nuevoDetalle.Cantidad_Producto),
      Precio_venta: parseFloat(nuevoDetalle.Precio_venta)
    }]);

    setNuevoDetalle({ id_Producto: '', Cantidad_Producto: '' });
    setProductoSel(null);
  };

  const eliminarDetalle = index => setDetalles(prev => prev.filter((_, i) => i !== index));

  return (
    <Modal show={mostrar} onHide={setMostrar} size="xl" fullscreen="lg-down">
      <Modal.Header closeButton>
        <Modal.Title>Editar Venta #{venta?.id_ventas}</Modal.Title>
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
                  loadOptions={cargarOpciones(clientes, 'primer_nombre')}
                  onChange={manejarCliente}
                  value={clienteSel}
                  placeholder="Buscar cliente..."
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="text"
                  value={ventaEnEdicion?.Fe_Venta || ''}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Productos</h5>
          <Row>
            <Col md={6}>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarOpciones(productos, 'nombre_producto')}
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
                value={nuevoDetalle.Cantidad_Producto}
                onChange={e => setNuevoDetalle(prev => ({ ...prev, Cantidad_Producto: e.target.value }))}
                min="1"
              />
            </Col>
            <Col md={3}>
              <Button variant="success" onClick={agregarDetalle} style={{ width: '100%' }}>Agregar</Button>
            </Col>
          </Row>

          {detalles?.length > 0 && (
            <Table striped className="mt-3">
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
                {detalles.map((d, i) => (
                  <tr key={i}>
                    <td>{d.nombre_producto}</td>
                    <td>{d.Cantidad_Producto}</td>
                    <td>C$ {d.Precio_venta.toFixed(2)}</td>
                    <td>C$ {(d.Cantidad_Producto * d.Precio_venta).toFixed(2)}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => eliminarDetalle(i)}>X</Button>
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
        <Button variant="secondary" onClick={setMostrar}>Cancelar</Button>
        <Button variant="primary" onClick={actualizarVenta}>Actualizar Venta</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionVenta;
