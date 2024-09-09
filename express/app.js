const express = require("express");
const cors = require("cors");
const db = require("./db");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

//Configurando variáveis de enviroment
const app = express();
dotenv.config({ path: "./config.env" });

//Routers
const signUpRouter = require("./controllers/signUpRouter");
const SignInRouter = require("./routes/signInRouter");
const tasksRouter = require("./routes/tasksRouter");
const signOutRouter = require("./routes/signOutRouter");

//Middleware pra liberar acesso de requests do browser
app.use(
  cors({
    origin: "http://localhost:5173", // Checar o port
    credentials: true, // Feito
  })
);

//Middleware pra receber JSON no payload
app.use(express.json());

//Middleware p parsear os cookies da request
app.use(cookieParser());

//Montando rotas
app.use("/signin", SignInRouter);
app.use("/signup", signUpRouter);
app.use("/tasks", tasksRouter);
app.use("/signout", signOutRouter);

const port = 3200;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

db.connect((err) => {
  if (err) return console.log(err.message);
  console.log("Conectado");
});
