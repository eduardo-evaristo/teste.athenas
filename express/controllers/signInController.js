const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./../db");
const { checkAcessToken } = require("./tasksController");

//Faz login do usuário
async function logInUser(req, res) {
  const { username, password } = req.body;
  const query = "SELECT * FROM usuarios WHERE username = $1";
  const queryResult = await db.query(query, [username]);
  const userId = queryResult?.rows[0]?.id;
  const hashedPassword1 = queryResult?.rows[0]?.password;
  console.log(hashedPassword1);
  console.log(userId);

  try {
    //Comparando senha passada com senha hasheada do banco de dados
    const result = await bcrypt.compare(password, hashedPassword1);
    if (result) {
      //Enviando accessToken
      const accessToken = jsonwebtoken.sign(
        { userId },
        process.env.JWT_PRIVATE_KEY
      );
      console.log(accessToken);

      //maxAge está p 1 mês
      res
        .status(200)
        .cookie("accessToken", accessToken, {
          maxAge: 2592000000,
          httpOnly: false,
          secure: true,
          sameSite: "none",
        })
        .json({ status: "success", data: username });
    } else {
      throw new Error("Senha inválida");
    }
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ status: "fail", message: "Credenciais inválidas." });
  }
}

//Checa se usuário já está logado no navegador, usando o cookie com o token JWT, se ele existir, o usuário está logado
async function isUserLoggedIn(req, res) {
  const accessToken = req?.cookies?.accessToken;
  if (!accessToken)
    return res
      .status(401)
      .json({ status: "fail", message: "Usuário não autenticado" });

  const userId = checkAcessToken(accessToken);

  const query = "SELECT username FROM usuarios WHERE id = $1";
  try {
    const queryResult = await db.query(query, [userId]);
    const data = queryResult.rows[0].username;
    //Envia o username do usuário para identificação no frontend
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Algo deu errado." });
  }
}

exports.logInUser = logInUser;
exports.isUserLoggedIn = isUserLoggedIn;
