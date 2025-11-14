import { Modal, Button } from "react-bootstrap";

const ModalEliminacionVenta = ({ mostrar, setMostrar, compra, confirmarEliminacion }) => {
  return (
    <Modal show={mostrar} onHide={setMostrar} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Está seguro de eliminar la compra del proveedor <b>{compra?.nombre_proveedor}</b>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={setMostrar}>Cancelar</Button>
        <Button variant="danger" onClick={confirmarEliminacion}>Eliminar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionVenta;