import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";

//Importando componentes usados na página
import { Container, ContainerTarefa } from "./../components/Container";
import { ControleTarefa, Tarefa } from "./../components/Tarefa";
import Modal from "./../components/Modal";
import Navbar from "./../components/Navbar";
import Pagination from "../components/Pagination";

export default function TasksPage() {
  //Controla se modal está aberto ou não
  const [isOpen, setIsOpen] = useState(false);
  //Controlq se modal deve estar em modo de edição ou criação
  const [isEditing, setIsEditing] = useState(null);
  //Recebe tasks vindas do banco de dados
  const [tasks, setTasks] = useState([]);
  //Controla quantidade de páginas que devem existir na paginação
  const [paginationControl, setPaginationControl] = useState(
    Math.ceil(tasks.length / 5) || 1
  );
  //Controla em qual página da paginação estamos
  const [currentPage, setCurrentPage] = useState(1);
  //State global para controlar se há um usuário logado ou não
  const { isUserLoggedIn } = useContext(AuthContext);
  //Controle de como estão filtradas as tarefas
  const [sort, setSort] = useState("Todas");
  //Tarefas filtradas (essas que são exibidas)
  const [sortedTasks, setSortedTasks] = useState([]);

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

  //Adiciona tarefa à lista
  async function handleAdd(taskObj) {
    try {
      const req = await fetch("http://127.0.0.1:3200/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          titulo: taskObj.titulo,
          descricao: taskObj.descricao,
          dtVencimento: taskObj.data,
          situacao: taskObj.situacao,
        }),
      });
      const res = await req.json();
      console.log(res);
      fetchTasks();
    } catch (err) {
      console.error(err.message);
    }
  }

  //Deleta uma tarefa
  async function handleDelete(taskObj) {
    try {
      const req = await fetch("http://127.0.0.1:3200/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          idTask: taskObj.id,
        }),
      });
      const res = await req.json();
      console.log(res);
      fetchTasks();
    } catch (err) {
      console.error(err.message);
    }
  }

  //Envia tarefa atualizada para substituir a prévia no banco de dados
  async function handleUpdate(taskObj) {
    try {
      await fetch("http://127.0.0.1:3200/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          idTask: taskObj.id,
          titulo: taskObj.titulo,
          descricao: taskObj.descricao,
          dtVencimento: taskObj.data,
          situacao: taskObj.situacao,
        }),
      });
      fetchTasks();
    } catch (err) {
      console.error(err.message);
    }
  }

  //Muda o estado de uma tarefa de 'Pendente' para 'Concluído'
  async function handleChangeTaskStatus(taskObj) {
    const dataJaPassou = validaData(taskObj.dt_vencimento);
    if (!dataJaPassou) return;
    try {
      const req = await fetch("http://127.0.0.1:3200/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          idTask: taskObj.id,
          situacao: taskObj.situacao === "pendente" ? "concluído" : "pendente",
        }),
      });
      const res = await req.json();
      console.log(res);
      fetchTasks();
    } catch (err) {
      console.log(err.message);
    }
  }

  //Função de utilidade para validar se data da tarefa pendente passou ou não
  function validaData(data) {
    //Obtendo data e definindo um ponto 0
    const dataInput = new Date(data).setHours(0, 0, 0, 0) || 0;
    const now = new Date(Date.now()).setHours(0, 0, 0, 0);

    //Validando se data dada é menor do que a data atual
    if (dataInput < now) {
      return false;
    }
    return true;
  }

  //Busca todas tarefas relacionadas ao usuário (se houver)
  async function fetchTasks() {
    if (!isUserLoggedIn) return;
    try {
      const req = await fetch("http://127.0.0.1:3200/tasks", {
        credentials: "include",
      });
      const res = await req.json();
      const data = res.data.data;
      console.log(data);
      setTasks([...data]);
    } catch (err) {
      console.log(err.message);
    }
  }

  //Muda paginação
  function handleChangePage(page) {
    setCurrentPage(page);
  }

  //Muda tipo de filtragem
  function handleSort(e) {
    setSort(e.target.value);
  }

  //Reage a mudanças em tasks e sort para refletir as últimas mudanças em ambas as variáveis
  useEffect(() => {
    console.log(sortedTasks);
    switch (sort) {
      case "Todas":
        setSortedTasks([...tasks]);
        break;
      case "Concluídas":
        setSortedTasks(tasks.filter((task) => task.situacao === "concluído"));
        break;
      case "Pendentes":
        setSortedTasks(tasks.filter((task) => task.situacao === "pendente"));
    }
  }, [tasks, sort]);

  //Carrega tasks do banco de dados na primeira render, reage à mudanças do state global isUserLoggedIn, que no início pode estar undefined
  useEffect(() => {
    fetchTasks();
  }, [isUserLoggedIn]);

  //Reage à variável tasks para definir a quantidade de páginas disponíveis
  useEffect(() => {
    setPaginationControl(Math.ceil(tasks.length / 5) || 1);
  }, [tasks]);

  return (
    <>
      <Navbar />
      <Container>
        <ControleTarefa onOpen={handleOpen} onSort={handleSort} />
        <ContainerTarefa>
          {isUserLoggedIn
            ? sortedTasks.map((task, i) => {
                //1 - 1 = 0 * 5 = 0 - começa do zero
                //1 * 5 = 5, termina no 5
                if (i >= (currentPage - 1) * 5 && i < currentPage * 5) {
                  return (
                    <Tarefa
                      taskObj={task}
                      key={task.id}
                      onDelete={handleDelete}
                      onConclude={handleChangeTaskStatus}
                      onEdit={handleEdit}
                    />
                  );
                }
              })
            : null}
        </ContainerTarefa>
      </Container>
      <Pagination
        paginationControl={paginationControl}
        currentPage={currentPage}
        onChangePage={handleChangePage}
      />
      {/* Controle do modal */}
      {isOpen && (
        <Modal
          show={isOpen}
          isEditing={isEditing}
          onClose={handleClose}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
