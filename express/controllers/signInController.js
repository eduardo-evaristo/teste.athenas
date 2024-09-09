const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./../db");

export async function logInUser(req, res) {
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
          httpOnly: false,
          secure: true,
          sameSite: "none", //
        })
        .json({ status: "success", message: "Você foi logado." });
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

export function checkAcessToken(accessToken) {
  //Extrai o id do usuário
  const userId = jsonwebtoken.verify(
    accessToken,
    process.env.JWT_PRIVATE_KEY
  ).userId;
  //Retorna userId
  return userId;
}
