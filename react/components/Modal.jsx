import { useEffect, useState } from "react";

//Hashmap c códigos p possíveis erros
const errors = new Map([
  [1, "Por favor, insira um título."],
  [2, "O título não pode exceder 100 caracteres."],
  [3, "Por favor, insira uma data válida."],
]);

export default function Modal({ show, isEditing, onClose, onAdd }) {
  const [titulo, setTitulo] = useState(isEditing ? isEditing.titulo : "");
  const [descricao, setDescricao] = useState(
    isEditing ? isEditing.descricao : ""
  );
  const [data, setData] = useState(isEditing ? isEditing.data : "");
  const [situacao, setSituacao] = useState(
    isEditing ? isEditing.situacao : "pendente"
  );
  const [error, setError] = useState(false);

  //Controles dos states de cada input
  function handleTitulo(e) {
    setError("");
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
    setError("");
    setData(e.target.value);
  }

  //TODO: Revisar essa funcionalidade
  function validaData() {
    const data1 = data.split("-");
    const data2 = [data1[1], data1[2], data1[0]].join("/");

    const dataInput = new Date(data2).setHours(0, 0, 0, 0) || 0;
    const now = new Date(Date.now()).setHours(0, 0, 0, 0);
    console.log(now, dataInput);
    console.log(dataInput === now);
    if (dataInput < now) {
      setError(errors.get(3));
      return false;
    }
    return true;
  }

  //Limpa campos após adição bem-sucedida
  function clearFields() {
    setData("");
    setTitulo("");
    setDescricao("");
    setSituacao("pendente");
  }

  function handleSave() {
    const newTask = { titulo, descricao, data, situacao };
    if (!titulo) return setError(errors.get(1));
    if (titulo.length > 100) return setError(errors.get(2));
    if (!validaData()) return;
    //Limpa campos
    clearFields();
    //Fecha modal
    onClose();
    //Adiciona objeto à variável de state
    onAdd(newTask);
  }

  //Sair do modal qnd apertar ESC
  useEffect(() => {
    const closeOutOfModal = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOutOfModal);
    console.log("entrou no effect");

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
                      value={data}
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
