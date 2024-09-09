async function signUserOut(req, res) {
  const accessToken = req?.cookies?.accessToken;

  //Se access token n existir
  if (!accessToken)
    return res
      .status(401)
      .json({ status: "fail", message: "Usuário não autenticado." });

  //Se access token existir
  res
    .status(200)
    .clearCookie("accessToken")
    .json({ status: "success", message: "Usuário deslogado." });
}

exports.signUserOut = signUserOut;
