import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

//Importando componentes usados
import Form from "./../components/Form";

//Caracteres não aceitos para evitar problemas no backend
const caracteresNaoAceitos = [
  "'",
  '"',
  "\\",
  ";",
  "--",
  "%",
  "_",
  "(",
  ")",
  "=",
  "<",
  ">",
  "!",
];

//Função de utilidade que valida o input
function validaInput(input) {
  return caracteresNaoAceitos.some((caracter) => input.includes(caracter));
}

//Componente da tela de cadastro
export function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //Controlando os inputs
  function handleUsername(e) {
    setError(null);
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setError(null);
    setPassword(e.target.value);
  }

  //Enviando ao backend
  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password)
      return setError("Por favor, insira as credenciais.");
    if (error) return;
    try {
      setIsLoading(true);
      const req = await fetch("http://127.0.0.1:3200/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const res = await req.json();
      if (!req.ok) {
        //Remove loader
        setIsLoading(false);
        //Mostra o erro retornado do back
        setError(res.message);
      } else {
        //Envia o usuário à página de login para entrar em sua conta
        return navigate("/signin");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("Algo deu errado.");
      console.error(err.message);
    }
  }

  //Setar erro caso caracter inválido
  useEffect(() => {
    if (validaInput(username) || validaInput(password)) {
      setError(`Caracteres inválidos: ${caracteresNaoAceitos.join(" ")}`);
    }
  }, [username, password]);

  return (
    <Form
      handleSubmit={handleSubmit}
      handleUsername={handleUsername}
      handlePassword={handlePassword}
      error={error}
      password={password}
      username={username}
      isLoading={isLoading}
    />
  );
}

//Componente da tela de login
export function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setIsUserLoggedIn } = useContext(AuthContext);

  //Controlando os inputs
  function handleUsername(e) {
    setError(null);
    setUsername(e.target.value);
  }
  function handlePassword(e) {
    setError(null);
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password)
      return setError("Por favor, insira as credenciais.");
    try {
      setIsLoading(true);
      const req = await fetch("http://127.0.0.1:3200/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        //P passar os cookies (aceitar no cors tb)
        credentials: "include",
      });
      const res = await req.json();
      if (!req.ok) {
        //Remove loader
        setIsLoading(false);
        //Mostra o erro retornado do backend para dar feedback
        setError(res.message);
      } else {
        //Seta o usuário atual ao state global de usuário para obter tarefas quando chegar à página principal
        setIsUserLoggedIn(res.data);
        navigate("/");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("Algo deu errado.");
      console.error(err.message);
    }
  }

  //Mostar erro caso caracter inválido
  useEffect(() => {
    if (validaInput(username) || validaInput(password)) {
      setError(`Caracteres inválidos: ${caracteresNaoAceitos.join(" ")}`);
    }
  }, [username, password]);

  return (
    <Form
      signIn={true}
      handleSubmit={handleSubmit}
      handleUsername={handleUsername}
      handlePassword={handlePassword}
      error={error}
      password={password}
      username={username}
      isLoading={isLoading}
    />
  );
}
