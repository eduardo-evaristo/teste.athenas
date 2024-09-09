//Handler final ppostar uma tarefa
export async function postTask(req, res) {
  console.log("entrou");
  const accessToken = req?.cookies?.accessToken;
  //Pegando payload que foi passado p o método sign do token e acessando userId nele

  //Se access token n existir
  if (!accessToken)
    return res
      .status(401)
      .json({ status: "fail", message: "Usuário não autenticado." });

  //Pegando payload que foi passado p o método sign do token e acessando userId nele
  const userId = checkAcessToken(accessToken);

  let { titulo, descricao, dtVencimento, situacao } = req.body;
  if (!descricao) descricao = null;

  if (!titulo || !dtVencimento || !situacao) return;

  const query =
    "INSERT INTO tarefas (titulo, descricao, dt_vencimento, situacao, id_usuario) values ($1, $2, $3, $4, $5)";

  try {
    await db.query(query, [titulo, descricao, dtVencimento, situacao, userId]);
    console.log("enviou");
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Algo deu errado! Por favor tente novamente.",
    });
  }
  res.status(201).json({ status: "success", message: "Tarefa criada!" });
}

export async function getAllTasks(req, res) {
  const accessToken = req.cookies.accessToken;

  //Se access token n existir
  if (!accessToken)
    return res
      .status(401)
      .json({ status: "fail", message: "Usuário não autenticado." });

  //Pegando payload que foi passado p o método sign do token e acessando userId nele
  const userId = checkAcessToken(accessToken);

  const query =
    "SELECT username, tarefas.id, titulo, dt_vencimento, descricao, situacao FROM tarefas JOIN usuarios ON tarefas.id_usuario = usuarios.id WHERE tarefas.id_usuario = $1 ORDER BY tarefas.id ASC";

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

export async function deleteTask(req, res) {
  const accessToken = req?.cookies?.accessToken;

  //Se access token n existir
  if (!accessToken)
    return res
      .status(401)
      .json({ status: "fail", message: "Usuário não autenticado." });

  //Pegando payload que foi passado p o método sign do token e acessando userId nele
  const userId = checkAcessToken(accessToken);

  //Possivelmente fazer isso numa função separada
  let { idTask } = req.body;

  if (!idTask) return;

  const query = "DELETE FROM tarefas WHERE id = $1 AND id_usuario = $2";

  try {
    await db.query(query, [idTask, userId]);
    console.log("enviou");
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Algo deu errado! Por favor tente novamente.",
    });
  }
  res.status(201).json({ status: "success", message: "Tarefa deletada!" });
}

export async function editTask(req, res) {
  const accessToken = req?.cookies?.accessToken;

  //Se access token n existir
  if (!accessToken)
    return res
      .status(401)
      .json({ status: "fail", message: "Usuário não autenticado." });

  //Pegando payload que foi passado p o método sign do token e acessando userId nele
  const userId = checkAcessToken(accessToken);

  let { idTask, titulo, descricao, dtVencimento, situacao } = req.body;
  if (!descricao) descricao = null;
  console.log(req.body, userId);

  const query =
    "UPDATE tarefas SET titulo = $1, descricao = $2, dt_vencimento = $3, situacao = $4 WHERE id = $5 AND id_usuario = $6";

  try {
    const data = await db.query(query, [
      titulo,
      descricao,
      dtVencimento,
      situacao,
      idTask,
      userId,
    ]);
    console.log(data);
    return res
      .status(200)
      .json({ status: "success", message: "Tarefa atualizada" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Algo deu errado! Por favor tente novamente.",
    });
  }
}

export async function changeTaskStatus(req, res) {
  const accessToken = req?.cookies?.accessToken;

  //Se access token n existir
  if (!accessToken)
    return res
      .status(401)
      .json({ status: "fail", message: "Usuário não autenticado." });

  //Pegando payload que foi passado p o método sign do token e acessando userId nele
  const userId = checkAcessToken(accessToken);

  const { situacao, idTask } = req.body;
  console.log(req.body);

  const query =
    "UPDATE tarefas SET situacao = $1 WHERE id = $2 AND id_usuario = $3";

  try {
    const data = await db.query(query, [situacao, idTask, userId]);
    console.log(data);
    return res
      .status(200)
      .json({ status: "success", message: "Tarefa atualizada" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Algo deu errado! Por favor tente novamente.",
    });
  }
}
