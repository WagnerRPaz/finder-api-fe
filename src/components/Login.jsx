import Logo from "../assets/Logo.png";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../index.css";
import React, { useContext } from "react";

function Login() {
  const { register, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext);
  const [error, setError] = React.useState(null);
  const history = useHistory();

  const handleLogin = async (data) => {
    try {
      await signIn(data);
      history.push("/categories");
      window.location.reload();
    } catch (error) {
      setError("Usuário ou senha incorretos");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to="/home">
            <img className="mx-auto h-60 w-auto" src={Logo} alt="Finder" />
          </Link>
        </div>
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
              {error}
            </div>
          )}
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit(handleLogin)}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  {...register("email")}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Senha
                </label>
              </div>
              <div className="mt-2">
                <input
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Entrar
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Não possui uma conta?{" "}
            <Link
              to="/register"
              className="font-semibold leading-6 text-green-600 hover:text-green-500"
            >
              Cadastrar
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
