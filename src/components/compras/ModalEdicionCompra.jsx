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

  // Función para obtener fecha de hoy en formato YYYY-MM-DD
  const hoy = () => new Date().toISOString().split('T')[0];

  // Función para fecha de caducidad por defecto: +1 año
  const caducidadDefault = () => {
    const fecha = new Date();
    fecha.setFullYear(fecha.getFullYear() + 1);
    return fecha.toISOString().split('T')[0];
  };

  // Se ejecuta al abrir el modal
  useEffect(() => {
    if (mostrar && compra) {
      setCompraEnEdicion({
        id_Proveedor: compra.id_Proveedor || "",
        Fe_compra: compra.Fe_compra?.split("T")[0] || ""
      });

      const detallesFormateados = (detalles || []).map(d => ({
        id_Producto: d.id_Producto || d.id_producto,
        Cantidad: d.Cantidad || d.cantidad || 0,
        Precio: parseFloat(d.Precio || d.precio || 0),
        Fe_Ingresado: (d.Fe_Ingresado?.split("T")[0]) || hoy(),  // ← LLENA SI ESTÁ VACÍO
        Fe_caducidad: (d.Fe_caducidad?.split("T")[0]) || caducidadDefault()  // ← +1 AÑO
      }));

      setDetalles(detallesFormateados);

      // Reinicia formulario con fechas por defecto
      setProductoSeleccionado("");
      setCantidad("");
      setPrecio("");
      setFeIngresado(hoy());
      setFeCaducidad(caducidadDefault());
    }
  }, [mostrar, compra, detalles]);

  const agregarDetalle = () => {
    if (!productoSeleccionado || !cantidad || !precio || !feIngresado || !feCaducidad) {
      alert("Completa todos los campos del detalle.");
      return;
    }

    const prod = productos.find(p =>
      p.id_Producto === parseInt(productoSeleccionado) || p.id_producto === parseInt(productoSeleccionado)
    );

    if (!prod) {
      alert("Producto no encontrado");
      return;
    }

    setDetalles(prev => [
      ...prev,
      {
        id_Producto: parseInt(productoSeleccionado),
        Cantidad: parseInt(cantidad),
        Precio: parseFloat(precio),
        Fe_Ingresado: feIngresado,
        Fe_caducidad: feCaducidad
      }
    ]);

    // Reinicia con valores por defecto
    setProductoSeleccionado("");
    setCantidad("");
    setPrecio("");
    setFeIngresado(hoy());
    setFeCaducidad(caducidadDefault());
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
          {/* Proveedor y Fecha */}
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
                    {p.Nombre_Proveedor || p.nombre_proveedor}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12} md={6}>
              <Form.Label className="fw-semibold small text-muted">Fecha Compra</Form.Label>
              <Form.Control
                type="date"
                value={compraEnEdicion?.Fe_compra || ""}
                onChange={e => setCompraEnEdicion(p => ({ ...p, Fe_compra: e.target.value }))}
                size="sm"
              />
            </Col>
          </Row>

          {/* Formulario para agregar producto */}
          <div className="bg-light p-3 rounded mb-3">
            <Row className="g-2 align-items-end">
              <Col xs={12} md={4}>
                <Form.Select
                  value={productoSeleccionado}
                  onChange={e => setProductoSeleccionado(e.target.value)}
                  size="sm"
                >
                  <option value="">Seleccione producto</option>
                  {productos.map(p => (
                    <option key={p.id_Producto || p.id_producto} value={p.id_Producto || p.id_producto}>
                      {p.nombre_producto || p.Nombre_Prod}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={6} md={1}>
                <Form.Control
                  type="number"
                  placeholder="Cant."
                  value={cantidad}
                  onChange={e => setCantidad(e.target.value)}
                  size="sm"
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
                />
              </Col>

              <Col xs={6} md={2}>
                <Form.Label className="small text-muted mb-1">Ingresado</Form.Label>
                <Form.Control
                  type="date"
                  value={feIngresado}
                  onChange={e => setFeIngresado(e.target.value)}
                  size="sm"
                />
              </Col>

              <Col xs={6} md={2}>
                <Form.Label className="small text-muted mb-1">Caducidad</Form.Label>
                <Form.Control
                  type="date"
                  value={feCaducidad}
                  onChange={e => setFeCaducidad(e.target.value)}
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

          {/* Tabla de detalles */}
          {detalles.length > 0 ? (
            <div className="table-responsive">
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
                      p => p.id_Producto === d.id_Producto || p.id_producto === d.id_Producto
                    );
                    return (
                      <tr key={i}>
                        <td>{prod?.nombre_producto || prod?.Nombre_Prod || "—"}</td>
                        <td className="text-center">{d.Cantidad}</td>
                        <td className="text-success text-center fw-bold">
                          ${Number(d.Precio).toFixed(2)}
                        </td>
                        <td className="text-center">
                          {d.Fe_Ingresado || hoy()}
                        </td>
                        <td className="text-center text-danger fw-bold">
                          {d.Fe_caducidad || caducidadDefault()}
                        </td>
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
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCompra;