const bcrypt = require("bcrypt");
const db = require("./../db");

//Funçao de utilidade pra hashear a senha
export async function hashPassword(password, rounds) {
  try {
    const hashedPassword = await bcrypt.hash(password, rounds);
    return hashedPassword;
  } catch (err) {
    throw new Error("Algo deu errado!");
  }
}

//Handlers/Middleware

//Handler final da rota "/signup"
export async function signUpUser(req, res) {
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

//Middleware p checar payload de login e signup
export function checkPayloadAuth(req, res, next) {
  console.log(req.cookies);
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ status: "error", message: "Credenciais inválidas!" });
  next();
}

//Middleware p checar se nome de usuário já existe
export async function checkIfUsernameExists(req, res, next) {
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
