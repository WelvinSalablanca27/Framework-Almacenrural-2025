import { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";

const ModalRegistroVenta = ({
  mostrar,
  setMostrar,
  nuevaVenta,
  setNuevaVenta,
  detalles,
  setDetalles,
  clientes = [],
  productos = [],
  agregarVenta,
}) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);

  const hoy = new Date().toISOString().split("T")[0]; // Fecha actual YYYY-MM-DD

  // Inicializar fecha al abrir modal
  useEffect(() => {
    if (mostrar) {
      setNuevaVenta({ ...nuevaVenta, fecha_venta: hoy });
    }
  }, [mostrar]);

  // Actualizar precio al cambiar producto
  useEffect(() => {
    if (Array.isArray(productos)) {
      const prod = productos.find(
        (p) => p.id_producto === parseInt(productoSeleccionado)
      );
      setPrecioUnitario(prod ? parseFloat(prod.precio_unitario) : 0);
    }
  }, [productoSeleccionado, productos]);

  const agregarDetalle = () => {
    if (!productoSeleccionado || cantidad <= 0) return;
    const prod = productos.find(
      (p) => p.id_producto === parseInt(productoSeleccionado)
    );
    if (!prod) return;

    const nuevoDetalle = {
      id_producto: prod.id_producto,
      nombre_producto: prod.nombre_producto,
      cantidad,
      precio_unitario: precioUnitario,
    };

    setDetalles([...detalles, nuevoDetalle]);
    setProductoSeleccionado("");
    setCantidad(1);
  };

  const eliminarDetalle = (index) => {
    const nuevos = detalles.filter((_, i) => i !== index);
    setDetalles(nuevos);
  };

  const totalVenta = detalles.reduce(
    (sum, d) => sum + d.cantidad * d.precio_unitario,
    0
  );

  const handleGuardar = () => {
    if (!nuevaVenta.id_cliente || detalles.length === 0) {
      alert("Selecciona un cliente y agrega al menos un producto.");
      return;
    }
    agregarVenta();
  };

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>
            <Form.Select
              value={nuevaVenta.id_cliente || ""}
              onChange={(e) =>
                setNuevaVenta({ ...nuevaVenta, id_cliente: e.target.value })
              }
            >
              <option value="">Seleccione un cliente</option>
              {Array.isArray(clientes) &&
                clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.primer_nombre} {c.primer_apellido}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de venta</Form.Label>
            <Form.Control
              type="date"
              value={nuevaVenta.fecha_venta || hoy}
              onChange={(e) =>
                setNuevaVenta({ ...nuevaVenta, fecha_venta: e.target.value })
              }
              max={hoy}
            />
          </Form.Group>

          <hr />

          <Form.Label>Agregar productos</Form.Label>
          <div className="d-flex gap-2 mb-3">
            <Form.Select
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
            >
              <option value="">Seleccione producto</option>
              {Array.isArray(productos) &&
                productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombre_producto}
                  </option>
                ))}
            </Form.Select>

            <Form.Control
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              placeholder="Cantidad"
            />

            <Form.Control
              type="number"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(parseFloat(e.target.value))}
              placeholder="Precio unitario"
            />

            <Button variant="primary" onClick={agregarDetalle}>
              + Agregar
            </Button>
          </div>

          {detalles.length > 0 && (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((d, i) => (
                  <tr key={i}>
                    <td>{d.nombre_producto}</td>
                    <td>{d.cantidad}</td>
                    <td>C$ {d.precio_unitario.toFixed(2)}</td>
                    <td>C$ {(d.cantidad * d.precio_unitario).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => eliminarDetalle(i)}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">
                    Total:
                  </td>
                  <td colSpan="2" className="fw-bold text-success">
                    C$ {totalVenta.toFixed(2)}
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
        <Button variant="success" onClick={handleGuardar}>
          Guardar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroVenta;
