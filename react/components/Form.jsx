export default function Form({
  signIn,
  handlePassword,
  handleSubmit,
  handleUsername,
  username,
  password,
  error,
  isLoading,
}) {
  return (
    <form
      className="container min-vh-100 d-flex flex-column justify-content-center max-w-25"
      onSubmit={handleSubmit}
    >
      <div className="container p-3 d-flex flex-column bg-light rounded shadow max-w-50">
        <h1 className="fs-3 text-center mb-3">
          {signIn ? "Faça login" : "Cadastre-se"}
        </h1>
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nome de usuário
          </label>
          <input
            type="text"
            className="form-control shadow"
            id="username"
            aria-describedby="usernameInput"
            value={username}
            onChange={handleUsername}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Senha
          </label>
          <input
            type="password"
            className="form-control shadow"
            id="password"
            value={password}
            onChange={handlePassword}
          />
        </div>
        <div className="mb-3">
          <div className="form-text">
            {signIn ? "Não possui conta?" : "Já possui conta?"}
            <span>
              <a href="#" className="link-primary">
                {signIn ? "Cadastre-se" : "Faça login"}
              </a>
            </span>
          </div>
        </div>
        <button
          type="submit"
          className={`btn btn-success shadow d-flex justify-content-between align-items-center ${
            isLoading || error ? "disabled" : ""
          }`}
        >
          {signIn ? "Entrar" : "Cadastrar-se"}
          {isLoading && (
            <>
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
              ></span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
