import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createContext } from "react";

export const AuthContext = createContext();

//Importando componentes
import TasksPage from "./pages/TasksPage";
import { SignUp, SignIn } from "./pages/Authentication";

//Rotas do app React
const router = createBrowserRouter([
  { path: "/", element: <TasksPage /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
]);

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    async function isUserLogged() {
      try {
        const req = await fetch("http://127.0.0.1:3200/signin/check", {
          method: "POST",
          credentials: "include",
        });
        const res = await req.json();
        const username = res.data;
        console.log(username);
        setIsUserLoggedIn(username);
      } catch (err) {
        console.log(err.message);
      }
    }
    isUserLogged();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </>
  );
}

export default App;
