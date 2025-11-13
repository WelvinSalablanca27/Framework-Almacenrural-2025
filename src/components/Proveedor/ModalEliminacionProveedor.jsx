import { Modal, Button } from "react-bootstrap";

const ModalEliminacionProveedor = ({
  mostrar,
  setMostrar,
  proveedorEliminado,
  confirmarEliminacion,
}) => {
  if (!proveedorEliminado) return null;

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Está seguro que desea eliminar al proveedor:{" "}
          <strong>{proveedorEliminado.Nombre_Proveedor}</strong>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={confirmarEliminacion}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProveedor;
