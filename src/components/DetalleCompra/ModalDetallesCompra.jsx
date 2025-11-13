import { Modal, Table, Button } from "react-bootstrap";

const ModalDetallesCompra = ({ mostrarModal, setMostrarModal, detalles }) => {
  // Aseguramos que detalles sea un array
  const detallesSeguros = Array.isArray(detalles) ? detalles : [];

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {detallesSeguros.length === 0 ? (
          <p className="text-muted text-center">No hay detalles para esta compra.</p>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead className="table-light">
              <tr>
                <th style={{ width: "50px" }}>#</th>
                <th>ID Detalle</th>
                <th>Producto</th>
                <th style={{ width: "100px" }}>Cantidad</th>
                <th style={{ width: "130px" }}>Precio Unit.</th>
                <th style={{ width: "130px" }}>Subtotal</th>
                <th style={{ width: "120px" }}>Fecha Ingreso</th>
                <th style={{ width: "120px" }}>Fecha Caducidad</th>
              </tr>
            </thead>
            <tbody>
              {detallesSeguros.map((d, index) => {
                const cantidad = d.Cantidad ?? 1;
                const precioUnitario = d.Precio != null ? parseFloat(d.Precio) : 0;
                const subtotal = cantidad * precioUnitario;

                return (
                  <tr key={d.id_DetalleCompra || index}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{d.id_DetalleCompra}</td>
                    <td>{d.nombre_producto || "Producto sin nombre"}</td>
                    <td className="text-center fw-bold text-primary">{cantidad}</td>
                    <td className="text-end">${precioUnitario.toFixed(2)}</td>
                    <td className="text-end fw-bold text-success">${subtotal.toFixed(2)}</td>
                    <td className="text-center">{d.Fe_Ingresado || "—"}</td>
                    <td className="text-center">{d.Fe_caducidad || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesCompra;
