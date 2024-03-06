import React, { useContext } from "react";
import Logo from "../assets/Logo.png";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import "../index.css";

function Register() {
  const { register, handleSubmit } = useForm();
  const { signUp } = useContext(AuthContext);

  const handleRegister = async (formData) => {
    const { confirmPassword, ...rest } = formData;
    const { password } = formData;

    if (!password || password.trim() === '' || password.length < 8 || !/[a-zA-Z]/.test(password) || password !== confirmPassword) {
      toastr.error('Erro: Verifique os campos e tente novamente.');
      return;
    }

    try {
      await signUp(rest);
      toastr.success('Cadastro realizado com sucesso!');
    } catch (error) {
      toastr.error('Erro durante o registro. Por favor, tente novamente.');
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
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit(handleRegister)}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nome
              </label>
              <div className="mt-2">
                <input
                  {...register("name")}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

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
                  style={{ paddingLeft: "10px" }}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Senha
              </label>
              <div className="mt-2">
                <input
                  {...register("password", {
                    required: true,
                    minLength: 8,
                    pattern: /^(?=.*\d).{8,}$/,
                  })}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <p className="text-sm text-gray-500 mt-1">
                  A senha deve ter pelo menos 8 caracteres um número.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirme a Senha
              </label>
              <div className="mt-2">
                <input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
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
                Cadastrar
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-green-600 hover:text-green-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;