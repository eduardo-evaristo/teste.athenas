const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");
const jsonwebtoken = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config({ path: "./config.env" });

//Middleware pra liberar acesso de requests do browser
app.use(cors());
//Middleware pra receber JSON no payload
app.use(express.json());

//Middleware p parsear os cookies da request
app.use(cookieParser());

//Handler final da rota /signup
async function signUpUser(req, res) {
  const { username, password } = req.body;
  const query = "INSERT INTO usuarios (username, password) values ($1, $2)";

  try {
    const hashedPassword = await hashPassword(password, 10);
    await db.query(query, [username, hashedPassword]);
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Algo deu errado! Por favor tente novamente.",
    });
  }

  res.status(201).json({ status: "success", message: "Usuário criado!" });
}

//FUnlçao de utilidade pra hashear a senha
async function hashPassword(password, rounds) {
  try {
    const hashedPassword = await bcrypt.hash(password, rounds);
    return hashedPassword;
  } catch (err) {
    throw new Error("Algo deu errado!");
  }
}

//Middleware p checar payload (sign in e sign up)
function checkPayloadAuth(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ status: "error", message: "Credenciais inválidas!" });
  next();
}

//Middleware p checar se nome de usuário já existe
async function checkIfUsernameExists(req, res, next) {
  const { username } = req.body;
  const query = "SELECT username FROM usuarios WHERE username = $1";
  try {
    const data = await db.query(query, [username]);
    const users = data.rows;

    //Se algum usuário for encontrado
    if (users.length) {
      return res.status(400).json({
        status: "fail",
        message: "Esse nome de usuário não está disponível!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Algo deu errado! Por favor tente novamente.",
    });
  }
  //Se não houver usuários com o nome passado
  next();
}

async function logInUser(req, res) {
  const { username, password } = req.body;
  const query = "SELECT * FROM usuarios WHERE username = $1";
  const queryResult = await db.query(query, [username]);
  const userId = queryResult?.rows[0]?.id;
  const hashedPassword1 = queryResult?.rows[0]?.password;
  console.log(hashedPassword1);
  console.log(userId);
  try {
    const result = await bcrypt.compare(password, hashedPassword1);
    if (result) {
      //Enviando accessToken
      const accessToken = jsonwebtoken.sign(
        { userId },
        process.env.JWT_PRIVATE_KEY
      );
      console.log(accessToken);
      //

      //maxAge está p 1 mês
      res
        .status(200)
        .cookie("accessToken", accessToken, {
          maxAge: 2592000000,
          httpOnly: true,
        })
        .json({ status: "success", message: "Você foi logado" });
    } else {
      throw new Error("Senha inválida");
    }
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ status: "fail", message: "Credenciais inválidas" });
  }
}

//Handler final ppostar uma tarefa
async function postTask(req, res) {
  const accessToken = req?.cookies?.accessToken;
  //Pegando payload que foi passado p o método sign do token e acessando userId nele
  const userId = jsonwebtoken.verify(
    accessToken,
    process.env.JWT_PRIVATE_KEY
  ).userId;

  if (!accessToken)
    return res
      .status(401)
      .json({ status: "fail", message: "Usuário não autenticado." });

  const { titulo, descricao, dtVencimento, situacao } = req.body;

  if (!titulo || !descricao || !dtVencimento || !situacao) return;

  const query =
    "INSERT INTO tarefas (titulo, descricao, dt_vencimento, situacao, id_usuario) values ($1, $2, $3, $4, $5)";

  try {
    await db.query(query, [titulo, descricao, dtVencimento, situacao, userId]);
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Algo deu errado! Por favor tente novamente.",
    });
  }
  res.status(201).json({ status: "success", message: "Tarefa criada!" });
}

async function getAllTasks(req, res) {
  const accessToken = req.cookies.accessToken;
  const userId = jsonwebtoken.verify(
    accessToken,
    process.env.JWT_PRIVATE_KEY
  ).userId;

  if (!accessToken) return;

  const query =
    "SELECT tarefas.id, titulo, dt_vencimento, descricao, situacao FROM tarefas JOIN usuarios ON tarefas.id_usuario = usuarios.id WHERE tarefas.id_usuario = $1";

  try {
    const data = await db.query(query, [userId]);
    return res
      .status(200)
      .json({ status: "success", data: { data: data.rows } });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Algo deu errado! Por favor tente novamente.",
    });
  }
}

//TODO: Checar se payload das tarefas está correto
function checkPayloadTasks() {}

app.post("/signup", checkPayloadAuth, checkIfUsernameExists, signUpUser);
app.post("/signin", checkPayloadAuth, logInUser);
app.post("/tasks", postTask);
app.get("/tasks", getAllTasks);

const port = 3200;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

db.connect((err) => {
  if (err) return console.log(err.message);
  console.log("Conectado");
});
