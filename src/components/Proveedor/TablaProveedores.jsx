import { useState } from "react";
import { Table, Spinner, Button, Card } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaProveedores = ({
  proveedores = [],
  cargando = false,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [orden, setOrden] = useState({ campo: "id_Proveedor", direccion: "asc" });
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const isMobile = useMediaQuery({ maxWidth: 767 });

  // ORDENAMIENTO
  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
    setPaginaActual(1);
  };

  const proveedoresOrdenados = [...proveedores].sort((a, b) => {
    const A = a[orden.campo];
    const B = b[orden.campo];
    if (typeof A === "number" && typeof B === "number") {
      return orden.direccion === "asc" ? A - B : B - A;
    }
    return orden.direccion === "asc"
      ? String(A).localeCompare(String(B))
      : String(B).localeCompare(String(A));
  });

  // PAGINACIÓN
  const totalElementos = proveedoresOrdenados.length;
  const inicio = (paginaActual - 1) * elementosPorPagina;
  const proveedoresPaginados = proveedoresOrdenados.slice(inicio, inicio + elementosPorPagina);

  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2 text-muted">Cargando proveedores...</p>
      </div>
    );
  }

  if (proveedores.length === 0) {
    return <p className="text-center text-muted">No hay proveedores registrados.</p>;
  }

  // VISTA MÓVIL (lista tipo producto)
  if (isMobile) {
    return (
      <div>
       

        <div className="d-flex flex-column gap-3">
          {proveedoresPaginados.map((p) => (
            <Card
              key={p.id_Proveedor}
              className="shadow-sm border-0"
              style={{
                borderRadius: "15px",
                background: "rgba(255, 255, 255, 0.97)",
                border: "2px solid #198754",
              }}
            >
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-bold text-success fs-5">
                      #{p.id_Proveedor} - {p.Nombre_Proveedor}
                    </div>
                  </div>
                  <div className="d-grid gap-1">
                    <Button size="sm" variant="info" onClick={() => abrirModalEdicion(p)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => abrirModalEliminacion(p)}>Eliminar</Button>
                  </div>
                </div>

                <hr className="my-2 border-success" />

                <div className="small">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Teléfono:</span>
                    <span>{p.Telefono || "-"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Email:</span>
                    <span>{p.Email || "-"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Dirección:</span>
                    <span>{p.Direccion || "-"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Distribuidor:</span>
                    <span>{p.Tipo_Distribuidor || "-"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Cond. Pago:</span>
                    <span>{p.Condiciones_Pago || "-"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Estado:</span>
                    <span>{p.Estado}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Registro:</span>
                    <span>{new Date(p.Fecha_Registro).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="mt-4">
          <Paginacion
            elementosPorPagina={elementosPorPagina}
            totalElementos={totalElementos}
            paginaActual={paginaActual}
            establecerPaginaActual={setPaginaActual}
          />
        </div>
      </div>
    );
  }

  // VISTA ESCRITORIO (tabla fija)
  return (
    <div style={{ maxHeight: "550px", overflowY: "auto" }}>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-success" style={{ position: "sticky", top: 0, zIndex: 10 }}>
          <tr>
            <BotonOrden campo="id_Proveedor" orden={orden} manejarOrden={manejarOrden}>ID</BotonOrden>
            <BotonOrden campo="Nombre_Proveedor" orden={orden} manejarOrden={manejarOrden}>Nombre</BotonOrden>
            <BotonOrden campo="Telefono" orden={orden} manejarOrden={manejarOrden}>Teléfono</BotonOrden>
            <BotonOrden campo="Email" orden={orden} manejarOrden={manejarOrden}>Email</BotonOrden>
            <BotonOrden campo="Direccion" orden={orden} manejarOrden={manejarOrden}>Dirección</BotonOrden>
            <BotonOrden campo="Tipo_Distribuidor" orden={orden} manejarOrden={manejarOrden}>Distribuidor</BotonOrden>
            <BotonOrden campo="Condiciones_Pago" orden={orden} manejarOrden={manejarOrden}>Cond. Pago</BotonOrden>
            <BotonOrden campo="Estado" orden={orden} manejarOrden={manejarOrden}>Estado</BotonOrden>
            <BotonOrden campo="Fecha_Registro" orden={orden} manejarOrden={manejarOrden}>Registro</BotonOrden>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedoresPaginados.map((p) => (
            <tr key={p.id_Proveedor}>
              <td>{p.id_Proveedor}</td>
              <td>{p.Nombre_Proveedor}</td>
              <td>{p.Telefono || "-"}</td>
              <td>{p.Email || "-"}</td>
              <td>{p.Direccion || "-"}</td>
              <td>{p.Tipo_Distribuidor || "-"}</td>
              <td>{p.Condiciones_Pago || "-"}</td>
              <td>{p.Estado}</td>
              <td>{new Date(p.Fecha_Registro).toLocaleDateString()}</td>
              <td className="d-flex gap-1 justify-content-center">
                <Button variant="info" size="sm" onClick={() => abrirModalEdicion(p)}>✏️ Editar</Button>
                <Button variant="danger" size="sm" onClick={() => abrirModalEliminacion(p)}>🗑️ Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center mt-2 mb-2">
        <Paginacion
          elementosPorPagina={elementosPorPagina}
          totalElementos={totalElementos}
          paginaActual={paginaActual}
          establecerPaginaActual={setPaginaActual}
        />
      </div>
    </div>
  );
};

export default TablaProveedores;
