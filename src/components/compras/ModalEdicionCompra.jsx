import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import { useState, useEffect } from "react";

const ModalEdicionCompra = ({
  mostrar,
  setMostrar,
  compra,
  compraEnEdicion,
  setCompraEnEdicion,
  detalles,
  setDetalles,
  proveedores,
  productos,
  actualizarCompra
}) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [feIngresado, setFeIngresado] = useState("");
  const [feCaducidad, setFeCaducidad] = useState("");

  // SE EJECUTA SOLO CUANDO SE ABRE EL MODAL
  useEffect(() => {
    if (mostrar && compra) {
      setCompraEnEdicion({
        id_Proveedor: compra.id_Proveedor || "",
        Fe_compra: compra.Fe_compra?.split(" ")[0] || ""
      });

      const detallesFormateados = (detalles || []).map(d => ({
        id_Producto: d.id_Producto,
        Cantidad: d.Cantidad || 0,
        Precio: parseFloat(d.Precio) || 0, // CORREGIDO
        Fe_Ingresado: d.Fe_Ingresado?.split(" ")[0] || "",
        Fe_caducidad: d.Fe_caducidad?.split(" ")[0] || ""
      }));
      setDetalles(detallesFormateados);

      setProductoSeleccionado("");
      setCantidad("");
      setPrecio("");
      setFeIngresado(new Date().toISOString().split('T')[0]);
      setFeCaducidad(new Date().toISOString().split('T')[0]);
    }
  }, [mostrar, compra]); // SIN DETALLES → NO BUCLE

  const agregarDetalle = () => {
    if (!productoSeleccionado || !cantidad || !precio || !feIngresado || !feCaducidad) {
      alert("Completa todos los campos del detalle.");
      return;
    }

    setDetalles(prev => [...prev, {
      id_Producto: parseInt(productoSeleccionado),
      Cantidad: parseInt(cantidad) || 0,
      Precio: parseFloat(precio) || 0, // CORREGIDO: NUNCA NaN
      Fe_Ingresado: feIngresado,
      Fe_caducidad: feCaducidad
    }]);

    setProductoSeleccionado("");
    setCantidad("");
    setPrecio("");
    setFeIngresado(new Date().toISOString().split('T')[0]);
    setFeCaducidad(new Date().toISOString().split('T')[0]);
  };

  const eliminarDetalle = (index) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const cerrar = () => setMostrar(false);

  return (
    <Modal show={mostrar} onHide={cerrar} backdrop="static" size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-primary">
          Editar Compra #{compra?.id_compra}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2 px-4">
        <Form>
          {/* PROVEEDOR Y FECHA */}
          <Row className="g-3 mb-3">
            <Col xs={12} md={6}>
              <Form.Label className="fw-semibold small text-muted">Proveedor</Form.Label>
              <Form.Select
                value={compraEnEdicion?.id_Proveedor || ""}
                onChange={e => setCompraEnEdicion(p => ({ ...p, id_Proveedor: e.target.value }))}
                size="sm"
              >
                <option value="">Seleccione...</option>
                {proveedores.map(p => (
                  <option key={p.id_Proveedor} value={p.id_Proveedor}>
                    {p.nombre || p.Nombre_Proveedor}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12} md={6}>
              <Form.Label className="fw-semibold small text-muted">Fecha</Form.Label>
              <Form.Control
                type="date"
                value={compraEnEdicion?.Fe_compra || ""}
                onChange={e => setCompraEnEdicion(p => ({ ...p, Fe_compra: e.target.value }))}
                size="sm"
              />
            </Col>
          </Row>

          {/* NUEVO DETALLE */}
          <div className="bg-light p-3 rounded mb-3">
            <Row className="g-2 align-items-end">
              <Col xs={12} md={4}>
                <Form.Select
                  value={productoSeleccionado}
                  onChange={e => setProductoSeleccionado(e.target.value)}
                  size="sm"
                >
                  <option value="">Producto</option>
                  {productos.map(p => (
                    <option key={p.id_Producto} value={p.id_Producto}>
                      {p.nombre_producto || p.Nombre_Prod}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={6} md={2}>
                <Form.Control
                  type="number"
                  placeholder="Cant."
                  value={cantidad}
                  onChange={e => setCantidad(e.target.value)}
                  size="sm"
                  className="text-center"
                />
              </Col>

              <Col xs={6} md={2}>
                <Form.Control
                  type="number"
                  placeholder="Precio"
                  value={precio}
                  onChange={e => setPrecio(e.target.value)}
                  step="0.01"
                  size="sm"
                  className="text-center"
                />
              </Col>

              <Col xs={6} md={2}>
                <Form.Control
                  type="date"
                  value={feIngresado}
                  onChange={e => setFeIngresado(e.target.value)}
                  size="sm"
                />
              </Col>

              <Col xs={6} md={2}>
                <Form.Control
                  type="date"
                  value={feCaducidad}
                  onChange={e => setFeCaducidad(e.target.value)}
                  size="sm"
                />
              </Col>

              <Col xs={12} md={1} className="text-md-end">
                <Button
                  variant="success"
                  size="sm"
                  onClick={agregarDetalle}
                  className="w-100"
                >
                  +
                </Button>
              </Col>
            </Row>
          </div>

          {/* TABLA RESPONSIVE */}
          {detalles.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover size="sm" className="small">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-center">Precio</th>
                    <th className="text-center">Ing.</th>
                    <th className="text-center">Cad.</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((d, i) => {
                    const prod = productos.find(p => p.id_Producto === d.id_Producto);
                    return (
                      <tr key={i}>
                        <td className="small">
                          {prod?.nombre_producto || prod?.Nombre_Prod || '—'}
                        </td>
                        <td className="text-center">{d.Cantidad}</td>
                        <td className="text-success text-center fw-bold">
                          ${Number(d.Precio || 0).toFixed(2)} {/* CORREGIDO: NUNCA NaN */}
                        </td>
                        <td className="text-center small">{d.Fe_Ingresado}</td>
                        <td className="text-center small">{d.Fe_caducidad}</td>
                        <td className="text-center">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => eliminarDetalle(i)}
                          >
                            X
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted small mt-3">
              No hay productos agregados.
            </p>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" size="sm" onClick={cerrar}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={actualizarCompra}
          disabled={!compraEnEdicion?.id_Proveedor || detalles.length === 0}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCompra;