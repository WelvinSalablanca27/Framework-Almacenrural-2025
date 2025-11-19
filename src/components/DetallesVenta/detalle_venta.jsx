import { Modal, Table, Button } from 'react-bootstrap';

const ModalDetallesVenta = ({ mostrarModal, setMostrarModal, detalles }) => {
  const detallesSeguros = Array.isArray(detalles) ? detalles : [];

  // Agrupamos por el nombre que sí tenemos guardado
  const productos = detallesSeguros.reduce((acc, d) => {
    const nombre = d.nombre_producto_guardado?.trim() || 
                   d.nombre_producto?.trim() || 
                   'Producto sin nombre';

    if (!acc[nombre]) {
      acc[nombre] = { nombre, cantidad: 0, precio: d.Precio_venta || 0 };
    }
    acc[nombre].cantidad += d.Cantidad_Producto || 0;
    return acc;
  }, {});

  const filas = Object.values(productos);
  const total = filas.reduce((sum, p) => sum + p.cantidad * p.precio, 0);

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 ? (
              <tr><td colSpan={4} className="text-center">No hay productos</td></tr>
            ) : (
              filas.map((p, i) => (
                <tr key={i}>
                  <td className="fw-medium">{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>C$ {Number(p.precio).toFixed(2)}</td>
                  <td>C$ {(p.cantidad * p.precio).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-end fw-bold fs-5">Total:</td>
              <td className="fw-bold text-danger fs-5">
                C$ {total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesVenta;