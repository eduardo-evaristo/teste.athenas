import { useEffect, useState } from "react";

//Hashmap c códigos p possíveis erros
const errors = new Map([
  [1, "Por favor, insira um título."],
  [2, "O título deve ter entre 3 e 100 caracteres."],
  [3, "Por favor, insira uma data válida."],
]);

export default function Modal({ show, isEditing, onClose, onAdd, onUpdate }) {
  const [titulo, setTitulo] = useState(isEditing ? isEditing.titulo : "");
  const [descricao, setDescricao] = useState(
    isEditing ? isEditing.descricao : ""
  );
  const [dataVencimento, setDataVencimento] = useState(
    isEditing
      ? new Date(isEditing.dt_vencimento).toISOString().split("T")[0]
      : ""
  );
  const [situacao, setSituacao] = useState(
    isEditing ? isEditing.situacao : "pendente"
  );
  const [error, setError] = useState(null);

  //Controles dos states de cada input
  function handleTitulo(e) {
    setError(null);
    setTitulo(e.target.value);
  }
  function handleDescricao(e) {
    setDescricao(e.target.value);
  }
  function handleSituacao(e) {
    console.log(e.target.value);
    setSituacao(e.target.value);
  }
  function handleData(e) {
    setError(null);
    setDataVencimento(e.target.value);
  }

  //TODO: Revisar essa funcionalidade - Feito
  function validaData(data) {
    const dataStep1 = data.split("-");
    const dataStep2 = [dataStep1[1], dataStep1[2], dataStep1[0]].join("/");

    const dataInput = new Date(dataStep2).setHours(0, 0, 0, 0) || 0;
    const now = new Date(Date.now()).setHours(0, 0, 0, 0);

    if (dataInput < now) {
      setError(errors.get(3));
      return false;
    }
    return dataStep2;
  }

  //Limpa campos após adição bem-sucedida
  function clearFields() {
    setDataVencimento("");
    setTitulo("");
    setDescricao("");
    setSituacao("pendente");
  }

  function handleSave() {
    //Se não houver título
    if (!titulo) return setError(errors.get(1));
    //Se título exceder ou não for grande o suficiente
    if (titulo.length > 100 || titulo.length < 3)
      return setError(errors.get(2));
    //Se data for válida (hoje ou no futuro), retornará true
    const data = validaData(dataVencimento);
    if (!data) return;

    //Cria objeto novo caso tudo esteja favorável
    const newTask = { titulo, descricao, data, situacao };
    //Limpa campos
    clearFields();
    //Adiciona objeto à variável de state
    isEditing ? onUpdate({ ...newTask, id: isEditing.id }) : onAdd(newTask);
    //Fecha modal e seta isEditing para falso
    onClose();
  }

  //Sair do modal qnd apertar ESC
  useEffect(() => {
    const closeOutOfModal = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOutOfModal);

    return () => {
      document.removeEventListener("keydown", closeOutOfModal);
    };
  });

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      id="exampleModalCenter"
      tabIndex="-1"
      aria-labelledby="exampleModalCenterTitle"
      style={{ display: show ? "block" : "none" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalCenterTitle">
              {isEditing ? "Editar tarefa" : "Adicionar tarefa"}
            </h1>
          </div>
          <div className="modal-body">
            {error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : null}
            <form>
              <div className="row">
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">
                      Título*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="titulo"
                      aria-describedby="emailHelp"
                      value={titulo}
                      required
                      maxLength={100}
                      onChange={handleTitulo}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
                      Descrição
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputPassword1"
                      value={descricao}
                      onChange={handleDescricao}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Data
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      value={dataVencimento}
                      onChange={handleData}
                    />
                  </div>
                </div>
                {!isEditing ? (
                  <div className="col">
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Situação
                      </label>
                      <select
                        id="disabledSelect"
                        className="form-select"
                        value={situacao}
                        onChange={handleSituacao}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="concluído">Concluído</option>
                      </select>
                    </div>
                  </div>
                ) : null}
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Voltar
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSave}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
