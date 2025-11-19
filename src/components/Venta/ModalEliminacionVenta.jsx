import { Modal, Button } from "react-bootstrap";

const ModalEliminacionVenta = ({ 
  mostrar, 
  setMostrar, 
  venta, 
  confirmarEliminacion 
}) => {

  const handleCerrar = () => setMostrar(false);
  const handleEliminar = () => {
    confirmarEliminacion(venta?.id_venta);
    handleCerrar();
  };

  return (
    <Modal show={mostrar} onHide={handleCerrar} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Está seguro de eliminar la venta del cliente <b>{venta?.nombre_cliente || "Cliente no registrado"}</b>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCerrar}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleEliminar}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionVenta;
