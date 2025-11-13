import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";

const ModalRegistroCompra = ({
  mostrar,
  setMostrar,
  nuevaCompra,
  setNuevaCompra,
  detalles,
  setDetalles,
  proveedores,
  productos,
  agregarCompra,
  hoy
}) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [feIngresado, setFeIngresado] = useState(hoy);
  const [feCaducidad, setFeCaducidad] = useState(hoy);

  // Reiniciar formulario al abrir modal
  useEffect(() => {
    if (mostrar) {
      setProductoSeleccionado(null);
      setCantidad("");
      setPrecio("");
      setFeIngresado(hoy);
      setFeCaducidad(hoy);
      setDetalles([]);
      setNuevaCompra(prev => ({ ...prev, id_Proveedor: '', Fe_compra: hoy }));
    }
  }, [mostrar, setDetalles, setNuevaCompra, hoy]);

  // Calcular total dinámico
  const totalCompra = detalles.reduce(
    (total, d) => total + d.Cantidad * d.Precio,
    0
  );

  const agregarDetalle = () => {
    if (!productoSeleccionado || !cantidad || !precio || !feIngresado || !feCaducidad) {
      alert("Completa todos los campos del detalle.");
      return;
    }

    const prod = productos.find(
      (p) => p.id_Producto === productoSeleccionado || p.id_producto === productoSeleccionado
    );

    if (!prod) {
      alert("Producto no encontrado");
      return;
    }

    const nuevoDetalle = {
      id_Producto: productoSeleccionado,
      Cantidad: parseInt(cantidad),
      Precio: parseFloat(precio),
      Fe_Ingresado: feIngresado,
      Fe_caducidad: feCaducidad,
    };

    setDetalles(prev => [...prev, nuevoDetalle]);

    // Reiniciar campos del detalle
    setProductoSeleccionado(null);
    setCantidad("");
    setPrecio("");
    setFeIngresado(hoy);
    setFeCaducidad(hoy);
  };

  const eliminarDetalle = (index) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const cerrar = () => setMostrar(false);

  const guardarCompra = () => {
    if (!nuevaCompra.id_Proveedor || detalles.length === 0) {
      alert("Completa proveedor y al menos un detalle.");
      return;
    }

    const compraFinal = {
      ...nuevaCompra,
      detalles
    };

    agregarCompra(compraFinal);
    cerrar();
  };

  return (
    <Modal show={mostrar} onHide={cerrar} backdrop="static" size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-success">Registrar Nueva Compra</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2 px-4">
        <Form>
          {/* Proveedor y Fecha */}
          <Row className="g-3 mb-3">
            <Col xs={12} md={6}>
              <Form.Label className="fw-semibold small text-muted">Proveedor</Form.Label>
              <Form.Select
                value={nuevaCompra.id_Proveedor ?? ""}
                onChange={(e) => setNuevaCompra(prev => ({ ...prev, id_Proveedor: Number(e.target.value) }))}
                size="sm"
              >
                <option value="">Seleccione...</option>
                {proveedores.map((p) => (
                  <option key={p.id_Proveedor} value={p.id_Proveedor}>
                    {p.Nombre_Proveedor || p.nombre_proveedor}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={6}>
              <Form.Label className="fw-semibold small text-muted">Fecha de Compra</Form.Label>
              <Form.Control
                type="date"
                value={nuevaCompra.Fe_compra}
                onChange={(e) => setNuevaCompra(prev => ({ ...prev, Fe_compra: e.target.value }))}
                size="sm"
              />
            </Col>
          </Row>

          {/* Agregar nuevo producto */}
          <div className="bg-light p-3 rounded mb-3">
            <Row className="g-2 align-items-end">
              <Col xs={12} md={4}>
                <Form.Select
                  value={productoSeleccionado ?? ""}
                  onChange={(e) => setProductoSeleccionado(Number(e.target.value))}
                  size="sm"
                >
                  <option value="">Seleccione producto</option>
                  {productos.map((p) => (
                    <option key={p.id_Producto || p.id_producto} value={p.id_Producto || p.id_producto}>
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
                  onChange={(e) => setCantidad(e.target.value)}
                  size="sm"
                  min="1"
                />
              </Col>

              <Col xs={6} md={2}>
                <Form.Control
                  type="number"
                  placeholder="Precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  step="0.01"
                  size="sm"
                  min="0.01"
                />
              </Col>

              <Col xs={6} md={2}>
                <Form.Control
                  type="date"
                  value={feIngresado}
                  onChange={(e) => setFeIngresado(e.target.value)}
                  size="sm"
                />
              </Col>

              <Col xs={6} md={2}>
                <Form.Control
                  type="date"
                  value={feCaducidad}
                  onChange={(e) => setFeCaducidad(e.target.value)}
                  size="sm"
                />
              </Col>

              <Col xs={12} md={1} className="text-md-end">
                <Button variant="success" size="sm" onClick={agregarDetalle} className="w-100">
                  +
                </Button>
              </Col>
            </Row>
          </div>

          {/* Tabla de productos agregados */}
          {detalles.length > 0 ? (
            <div className="table-responsive mb-2">
              <Table striped bordered hover size="sm" className="small">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-center">Precio</th>
                    <th className="text-center">Ingresado</th>
                    <th className="text-center">Caducidad</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((d, i) => {
                    const prod = productos.find(
                      (p) => p.id_Producto === d.id_Producto || p.id_producto === d.id_Producto
                    );
                    return (
                      <tr key={i}>
                        <td>{prod?.nombre_producto || prod?.Nombre_Prod || "—"}</td>
                        <td className="text-center">{d.Cantidad}</td>
                        <td className="text-success text-center fw-bold">
                          ${Number(d.Precio).toFixed(2)}
                        </td>
                        <td className="text-center">{d.Fe_Ingresado}</td>
                        <td className="text-center">{d.Fe_caducidad}</td>
                        <td className="text-center">
                          <Button variant="danger" size="sm" onClick={() => eliminarDetalle(i)}>
                            X
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <div className="text-end fw-bold small">
                Total: ${totalCompra.toFixed(2)}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted small mt-3">No hay productos agregados.</p>
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
          onClick={guardarCompra}
          disabled={!nuevaCompra.id_Proveedor || detalles.length === 0}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCompra;