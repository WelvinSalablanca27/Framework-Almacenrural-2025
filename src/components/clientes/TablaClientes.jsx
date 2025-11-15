import { useState, useEffect } from "react";
import { Table, Card, Spinner, Button, Row, Col } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaClientes = ({
  clientes,
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
}) => {
  const [orden, setOrden] = useState({ campo: "id_Cliente", direccion: "asc" });
  const [esMovil, setEsMovil] = useState(window.innerWidth < 768);

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const clientesOrdenadas = [...clientes].sort((a, b) => {
    const valorA = a[orden.campo];
    const valorB = b[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  // Detectar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => setEsMovil(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (cargando)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  if (esMovil) {
    // 🔹 MODO MÓVIL: TARJETAS
    return (
      <>
        {clientesOrdenadas.map((cliente) => {
          const nombreCompleto = `
            ${cliente.Nombre1 || ""} 
            ${cliente.Nombre2 || ""} 
            ${cliente.Apellido1 || ""} 
            ${cliente.Apellido2 || ""}
          `
            .trim()
            .replace(/\s+/g, " ");

          return (
            <Card
              key={cliente.id_Cliente}
              className="mb-3 shadow-sm border-0"
              style={{ borderRadius: "16px", padding: "15px" }}
            >
              <h5 className="fw-bold text-success mb-2">{nombreCompleto}</h5>
              <p className="mb-1" style={{ fontSize: "13px" }}>
                <strong>ID:</strong> {cliente.id_Cliente}
              </p>
              <p className="mb-1" style={{ fontSize: "13px" }}>
                <strong>Dirección:</strong> {cliente.Direccion || "—"}
              </p>
              <p className="mb-1" style={{ fontSize: "13px" }}>
                <strong>Teléfono:</strong> {cliente.Telefono || "—"}
              </p>
              <div className="d-flex justify-content-between mt-3">
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => abrirModalEdicion(cliente)}
                >
                  ✏ Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(cliente)}
                >
                  🗑 Eliminar
                </Button>
              </div>
            </Card>
          );
        })}
        <Paginacion
          elementosPorPagina={elementosPorPagina}
          totalElementos={totalElementos}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />
      </>
    );
  } else {
    // 🔹 MODO ESCRITORIO: TABLA CLÁSICA
    return (
      <>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <BotonOrden campo="id_Cliente" orden={orden} manejarOrden={manejarOrden}>
                ID
              </BotonOrden>
              <BotonOrden campo="Nombre1" orden={orden} manejarOrden={manejarOrden}>
                Nombre1
              </BotonOrden>
              <BotonOrden campo="Nombre2" orden={orden} manejarOrden={manejarOrden}>
                Nombre2
              </BotonOrden>
              <BotonOrden campo="Apellido1" orden={orden} manejarOrden={manejarOrden}>
                Apellido1
              </BotonOrden>
              <BotonOrden campo="Apellido2" orden={orden} manejarOrden={manejarOrden}>
                Apellido2
              </BotonOrden>
              <BotonOrden campo="Direccion" orden={orden} manejarOrden={manejarOrden}>
                Dirección
              </BotonOrden>
              <BotonOrden campo="Telefono" orden={orden} manejarOrden={manejarOrden}>
                Teléfono
              </BotonOrden>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesOrdenadas.map((cliente) => (
              <tr key={cliente.id_Cliente}>
                <td>{cliente.id_Cliente}</td>
                <td>{cliente.Nombre1}</td>
                <td>{cliente.Nombre2}</td>
                <td>{cliente.Apellido1}</td>
                <td>{cliente.Apellido2}</td>
                <td>{cliente.Direccion}</td>
                <td>{cliente.Telefono}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEdicion(cliente)}
                  >
                    ✏
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(cliente)}
                  >
                    🗑
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginacion
          elementosPorPagina={elementosPorPagina}
          totalElementos={totalElementos}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />
      </>
    );
  }
};

export default TablaClientes;
