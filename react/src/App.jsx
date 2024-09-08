import { useState } from "react";

//Importando componentes
import { Container, ContainerTarefa } from "../components/Container";
import { ControleTarefa, Tarefa } from "../components/Tarefa";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [tasks, setTasks] = useState([]);

  //Abre modal (criar tarefa)
  function handleOpen() {
    setIsOpen(true);
  }

  //Fecha modal
  function handleClose() {
    setIsOpen(false);
    setIsEditing(null);
  }

  //Abre modal (edição)
  function handleEdit(taskObj) {
    setIsEditing(taskObj);
    handleOpen();
  }

  //Adiciona tarefa A` lista
  function handleAdd(taskObj) {
    setTasks((prevTasks) => [...prevTasks, taskObj]);
  }

  //When tasks come from db, handle this using ID instead
  function handleDelete(taskObj) {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.titulo !== taskObj.titulo)
    );
  }

  //Esperar dados virem do db pra usar id nisso
  function handleUpdate(taskObj) {
    /* gotta map updated obj to old object*/
  }

  //Conclui tarefa - Mudar para id depois
  //TODO: Checar se data do objeto não ultrapassou a data atual - Feito
  function handleConclude(taskObj) {
    const dataJaPassou = validaData(taskObj.data);
    if (!dataJaPassou) return;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.titulo === taskObj.titulo
          ? { ...task, situacao: "concluído" }
          : task
      )
    );
  }

  //'Desconclui' tarefa - Mudar para id depois
  function handleUnconclude(taskObj) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.titulo === taskObj.titulo
          ? { ...task, situacao: "pendente" }
          : task
      )
    );
  }

  function validaData(data) {
    const dataInput = new Date(data).setHours(0, 0, 0, 0) || 0;
    const now = new Date(Date.now()).setHours(0, 0, 0, 0);
    console.log(now, dataInput);
    console.log(dataInput === now);
    if (dataInput < now) {
      return false;
    }
    return true;
  }

  return (
    <>
      <Navbar />
      <Container>
        <ControleTarefa onOpen={handleOpen} />
        <ContainerTarefa>
          {tasks.map((task) => (
            <Tarefa
              taskObj={task}
              key={Math.random()}
              onDelete={handleDelete}
              onConclude={handleConclude}
              onUnconclude={handleUnconclude}
              onEdit={handleEdit}
            />
          ))}
        </ContainerTarefa>
      </Container>
      {/* Controle do modal */}
      {isOpen && (
        <Modal
          show={isOpen}
          isEditing={isEditing}
          onClose={handleClose}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}

export default App;
