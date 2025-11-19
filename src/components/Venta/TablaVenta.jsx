import { useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Paginacion from "../ordenamiento/Paginacion";

const TablaVentas = ({
  ventas = [],
  cargando = false,
  obtenerDetalles,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos = 0,
  elementosPorPagina = 5,
  paginaActual = 1,
  establecerPaginaActual,
}) => {
  const [orden, setOrden] = useState({ campo: "id_venta", direccion: "asc" });

  // Función para cambiar el orden de las columnas
  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  // Mapear las ventas para tener siempre un nombre completo del cliente
  const ventasConNombre = ventas.map((v) => ({
    ...v,
    nombre_cliente: v.nombre_cliente
      ? v.nombre_cliente
      : v.Cliente
      ? `${v.Cliente.nombre} ${v.Cliente.apellido}`
      : "Cliente no registrado",
  }));

  // Ordenar las ventas según la columna y dirección
  const ventasOrdenadas = [...ventasConNombre].sort((a, b) => {
    const valorA = a[orden.campo];
    const valorB = b[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    return orden.direccion === "asc"
      ? String(valorA || "").localeCompare(String(valorB || ""))
      : -String(valorA || "").localeCompare(String(valorB || ""));
  });

  // Función para imprimir ticket
  const imprimirTicket = (venta) => {
    const ticket = `
Cliente: ${venta.nombre_cliente}
Fecha: ${venta.Fe_Venta ? format(new Date(venta.Fe_Venta), "dd/MM/yyyy") : "—"}
Total: C$ ${parseFloat(venta.total_venta || 0).toFixed(2)}
`;
    const ventana = window.open("", "", "width=400,height=600");
    ventana.document.write(`<pre>${ticket}</pre>`);
    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  };

  if (cargando)
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" role="status" />
        <div className="mt-3 text-muted fs-5">Cargando ventas...</div>
      </div>
    );

  return (
    <>
      <Table striped bordered hover responsive>
        <thead className="table-dark text-center">
          <tr>
            <th
              onClick={() => manejarOrden("id_venta")}
              style={{ cursor: "pointer" }}
            >
              ID {orden.campo === "id_venta" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              onClick={() => manejarOrden("Fe_Venta")}
              style={{ cursor: "pointer" }}
            >
              Fecha {orden.campo === "Fe_Venta" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              onClick={() => manejarOrden("nombre_cliente")}
              style={{ cursor: "pointer" }}
            >
              Cliente {orden.campo === "nombre_cliente" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              onClick={() => manejarOrden("total_venta")}
              style={{ cursor: "pointer" }}
            >
              Total {orden.campo === "total_venta" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasOrdenadas.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-5 text-muted fs-5">
                No se encontraron ventas
              </td>
            </tr>
          ) : (
            ventasOrdenadas
              .slice(
                (paginaActual - 1) * elementosPorPagina,
                paginaActual * elementosPorPagina
              )
              .map((v, idx) => (
                <tr key={v.id_venta ?? `venta-${idx}`}>
                  <td className="text-center fw-bold">{v.id_venta ?? "—"}</td>
                  <td>
                    {v.Fe_Venta
                      ? format(new Date(v.Fe_Venta), "dd MMM yyyy", { locale: es })
                      : "—"}
                    <br />
                    <small className="text-muted">
                      {v.Fe_Venta
                        ? format(new Date(v.Fe_Venta), "hh:mm a", { locale: es })
                        : "—"}
                    </small>
                  </td>
                  <td>{v.nombre_cliente}</td>
                  <td className="text-end fw-bold text-success">
                    C$ {parseFloat(v.total_venta || 0).toFixed(2)}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2 mb-1"
                      onClick={() => imprimirTicket(v)}
                    >
                      Ticket
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2 mb-1"
                      onClick={() => obtenerDetalles(v.id_venta)}
                    >
                      Detalles
                    </Button>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-2 mb-1"
                      onClick={() => abrirModalEdicion(v)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="mb-1"
                      onClick={() => abrirModalEliminacion(v)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
          )}
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
};

export default TablaVentas;
