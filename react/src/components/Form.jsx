import { Link } from "react-router-dom";
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
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <form className="container p-4 w-100 w-lg-35" onSubmit={handleSubmit}>
        <div className="container p-3 d-flex flex-column bg-primary rounded shadow max-w-50">
          <h1 className="fs-3 text-center text-white fw-bold mb-3">
            {signIn ? "Faça login" : "Cadastre-se"}
          </h1>
          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-white">
              Nome de usuário
            </label>
            <input
              type="text"
              className="form-control shadow"
              id="username"
              minLength={3}
              maxLength={100}
              aria-describedby="usernameInput"
              value={username}
              onChange={handleUsername}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-white">
              Senha
            </label>
            <input
              type="password"
              className="form-control shadow"
              id="password"
              minLength={8}
              maxLength={100}
              value={password}
              onChange={handlePassword}
            />
          </div>
          <div className="mb-3">
            <div className="form-text text-white">
              {signIn ? "Não possui conta?" : "Já possui conta?"}
              <span>
                <Link
                  to={signIn ? "/signup" : "/signin"}
                  className="mx-2 text-white"
                >
                  {signIn ? "Cadastre-se" : "Faça login"}
                </Link>
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
    </div>
  );
}
