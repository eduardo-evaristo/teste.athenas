import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./../App";

export default function Navbar() {
  const { isUserLoggedIn, setIsUserLoggedIn } = useContext(AuthContext);

  //Desloga o usuário
  async function handleSignOut() {
    try {
      const req = await fetch("http://127.0.0.1:3200/signout", {
        method: "POST",
        credentials: "include",
      });
      const res = await req.json();
      console.log(res);
      //Remove o valor do state global de usuário para refletir mudanças visuais ao deslogar
      setIsUserLoggedIn(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light p-3">
      <div className="container-fluid d-flex justify-content-between p-3 bg-primary rounded">
        <a className="navbar-brand disabled fs-3 text-white">
          <span>
            <i className="bi bi-list-task"></i>
          </span>{" "}
          To-Do List
        </a>
        <div className="">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {isUserLoggedIn ? (
                <>
                  <li className="nav-item">
                    <a href="/" className="nav-link text-white">
                      {isUserLoggedIn}
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/"
                      className="nav-link text-white"
                      onClick={handleSignOut}
                    >
                      Sair
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/signin" className="nav-link text-white">
                      Entrar
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/signup" className="nav-link text-white">
                      Registrar-se
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
