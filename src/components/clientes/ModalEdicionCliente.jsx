import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCliente = ({
    mostrar,
    setMostrar,
    clienteEditada,
    setClienteEditada,
    guardarEdicion,
}) => {
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setClienteEditada((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="Nombre1">
                        <Form.Label>Nombre 1 del Cliente</Form.Label>
                        <Form.Control
                            type="text"
                            name="Nombre1"
                            value={clienteEditada?.Nombre1 || ""}
                            onChange={manejarCambio}
                            placeholder="Ej: Enrique"
                            maxLength={20}
                            required
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Nombre2">
                        <Form.Label>Nombre 2 del Cliente</Form.Label>
                        <Form.Control
                            type="text"
                            name="Nombre2"
                            value={clienteEditada?.Nombre2 || ""}
                            onChange={manejarCambio}
                            placeholder="Ej: Manuel"
                            maxLength={20}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Apellido1">
                        <Form.Label>Apellido 1 del Cliente</Form.Label>
                        <Form.Control
                            type="text"
                            name="Apellido1"
                            value={clienteEditada?.Apellido1 || ""}
                            onChange={manejarCambio}
                            placeholder="Ej: Hernández"
                            maxLength={20}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Apellido2">
                        <Form.Label>Apellido 2 del Cliente</Form.Label>
                        <Form.Control
                            type="text"
                            name="Apellido2"
                            value={clienteEditada?.Apellido2 || ""}
                            onChange={manejarCambio}
                            placeholder="Ej: Martínez"
                            maxLength={20}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Direccion">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="Direccion"
                            value={clienteEditada?.Direccion || ""}
                            onChange={manejarCambio}
                            placeholder="Descripción opcional (máx. 100 caracteres)"
                            maxLength={150}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Telefono">
                        <Form.Label>Teléfono del Cliente</Form.Label>
                        <Form.Control
                            type="text"
                            name="Telefono"
                            value={clienteEditada?.Telefono || ""}
                            onChange={manejarCambio}
                            placeholder="Ej: 8538****"
                            maxLength={8}
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrar(false)}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={guardarEdicion}
                    disabled={!clienteEditada?.Nombre1 || !clienteEditada?.Nombre1.trim()}
                >
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionCliente;
