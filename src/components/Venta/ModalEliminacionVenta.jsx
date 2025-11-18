import { Modal, Button } from "react-bootstrap";

const ModalEliminacionVenta = ({ mostrar, setMostrar, venta, confirmarEliminacion }) => {
  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          ¿Estás seguro de eliminar la venta <strong>#{venta?.id_ventas}</strong>?
        </p>
        <p className="text-danger">Esta acción no se puede deshacer.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={confirmarEliminacion}>
          Sí, eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionVenta;
