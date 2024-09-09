export function Tarefa({
  taskObj,
  onDelete,
  onConclude,
  onUnconclude,
  onEdit,
}) {
  return (
    <div className="row p-2 align-items-center bg-light rounded my-2 shadow-sm d-flex flex-column flex-sm-column flex-md-row text-center gap-4 gap-lg-0">
      <div className="col py-2 border rounded border-sm-0 text-wrap text-break shadow-sm shadow-lg-none">
        <div className="text-secondary">{taskObj.titulo}</div>
      </div>
      <div className="col-md-3s col-lg py-2 py-sm-0 border rounded border-sm-0 text-wrap text-break shadow-sm shadow-lg-none">
        <div className="text-secondary">{taskObj.descricao}</div>
      </div>
      <div className="col py-2 py-sm-0 border rounded border-sm-0 text-wrap text-break shadow-sm shadow-lg-none">
        <div className="text-secondary">
          {taskObj.dt_vencimento || taskObj.data}
        </div>
      </div>
      <div className="col d-flex gap-2 justify-content-center my-2 my-sm-0">
        {taskObj.situacao === "concluído" ? (
          <button
            className="btn btn-secondary btn-sm btn-lg-lg"
            onClick={() => onConclude(taskObj)}
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        ) : (
          <button
            className="btn btn-success btn-sm btn-lg-lg"
            onClick={() => onConclude(taskObj)}
          >
            <i className="bi bi-check-lg"></i>
          </button>
        )}
        <button
          className="btn btn-warning btn-sm"
          onClick={() => onEdit(taskObj)}
        >
          <i className="bi bi-pencil-fill"></i>
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(taskObj)}
        >
          <i className="bi bi-trash3-fill"></i>
        </button>
      </div>
    </div>
  );
}

export function ControleTarefa({ onOpen }) {
  return (
    <div className="row bg-light justify-content-around align-items-center rounded p-4 fw-bold fs-5 d-flex flex-column flex-sm-row">
      <div className="col text-center mb-3 mb-sm-0">
        <div className="text-body">Tarefas</div>
      </div>
      <div className="col d-flex gap-2 justify-content-center justify-content-sm-end">
        <button className="btn btn-success btn" onClick={onOpen}>
          <i className="bi bi-plus-lg"></i> Adicionar
        </button>
        <button className="btn btn-warning btn">
          <i className="bi bi-funnel-fill"></i> Filtrar
        </button>
      </div>
    </div>
  );
}
