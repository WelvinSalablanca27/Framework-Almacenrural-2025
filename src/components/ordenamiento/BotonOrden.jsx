const BotonOrden = ({ campo, children, orden, manejarOrden }) => {
  const activo = orden.campo === campo;

  return (
    <th
      style={{ cursor: "pointer", userSelect: "none" }}
      onClick={() => manejarOrden(campo)}
      className="text-nowrap"
    >
      <div className="d-flex align-items-center justify-content-between">
        <span>{children}</span>
        <i
          className={`bi ms-2 ${activo
              ? orden.direccion === "asc"
                ? "bi-caret-up-fill text-primary"
                : "bi-caret-down-fill text-primary"
              : "bi-sort text-muted"
            }`}
          style={{
            fontSize: "0.8rem",
            minWidth: "16px",
            display: "inline-block"
          }}
        />
      </div>
    </th>
  );
};
export default BotonOrden;
