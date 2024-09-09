import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createContext } from "react";

export const AuthContext = createContext();

//Importando componentes
import { Container, ContainerTarefa } from "../components/Container";
import { ControleTarefa, Tarefa } from "../components/Tarefa";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import { SignUp, SignIn } from "./Authentication";

//Rotas do app React
const router = createBrowserRouter([
  { path: "/", element: <TasksPage /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
]);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function isUserLogged() {
      try {
        const req = await fetch("http://127.0.0.1:3200/tasks", {
          credentials: "include",
        });
        const res = await req.json();
        const data = res.data.data;
        setIsLoggedIn({ username: data[0].username });
      } catch (err) {
        console.log(err.message);
      }
    }
    isUserLogged();
  }, []);

  return (
    <>
      <AuthContext.Provider value={isLoggedIn}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </>
  );
}

export default App;

function TasksPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [paginationControl, setPaginationControl] = useState(
    Math.ceil(tasks.length / 5) || 1
  );
  const [currentPage, setCurrentPage] = useState(1);

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
      //setTasks((prevTasks) => [...prevTasks, taskObj]);
    } catch (err) {
      console.log(err.message);
    }
  }

  //When tasks come from db, handle this using ID instead - Feito
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
      /*
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskObj.id)
      );*/
    } catch (err) {
      console.log(err.message);
    }
  }

  //Esperar dados virem do db pra usar id nisso
  async function handleUpdate(taskObj) {
    try {
      const req = await fetch("http://127.0.0.1:3200/tasks", {
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
      const res = await req.json();
      fetchTasks();
    } catch (err) {
      console.log(err.message);
    }
  }

  //Conclui tarefa - Mudar para id depois
  //TODO: Checar se data do objeto não ultrapassou a data atual - Feito
  //Refatorado pra handleChangeTaskStatus
  /*
  async function handleConclude(taskObj) {
    const dataJaPassou = validaData(taskObj.dt_vencimento);
    if (!dataJaPassou) return;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskObj.id ? { ...task, situacao: "concluído" } : task
      )
    );
  }
    */

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
    /*
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskObj.id ? { ...task, situacao: "concluído" } : task
      )
    );
    */
  }

  //'Desconclui' tarefa - Mudar para id depois
  //Refatorado pra handleChangeTaskStatus
  /*
  function handleUnconclude(taskObj) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskObj.id ? { ...task, situacao: "pendente" } : task
      )
    );
  }
  */

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

  async function fetchTasks() {
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

  function handleChangePage(page) {
    setCurrentPage(page);
  }

  //Carrega tasks do banco de dados na primeira render
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setPaginationControl(Math.ceil(tasks.length / 5) || 1);
  }, [tasks]);

  return (
    <>
      <Navbar />
      <Container>
        <ControleTarefa onOpen={handleOpen} />
        <ContainerTarefa>
          {tasks.map((task, i) => {
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
          })}
        </ContainerTarefa>
      </Container>
      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          {Array.from({ length: paginationControl }, (_, i) => (
            <li
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              key={i + 1}
              onClick={() => handleChangePage(i + 1)}
            >
              <a className="page-link">{i + 1}</a>
            </li>
          ))}
        </ul>
      </nav>
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
