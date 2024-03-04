import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Disclosure, Menu } from "@headlessui/react";
import Logo from "../assets/Logo.png";
import Perfil from "../assets/Perfil.png";
import { AuthContext, useAuth } from "../contexts/AuthContext";
import WorkerApi from "../services/api";
import { useForm } from "react-hook-form";

const navigation = [
  { name: "Home", href: "/home", current: false },
  { name: "Categorias", href: "/categories", current: false },
  { name: "Avalie", href: "/rating", current: true },
  { name: "Faça parte do nosso time", href: "/workerRegister", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Rating() {
  const { signOut, user } = useContext(AuthContext);
  const history = useHistory();
  const { register, handleSubmit, watch } = useForm();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [commentLength, setCommentLength] = useState(0);
  const [rating, setRating] = useState(0);
  const [showThanks, setShowThanks] = useState(false);

  const handleSignOut = async () => {
    signOut();
  };

  const userNavigation = [{ name: "Sair", href: "/", onClick: handleSignOut }];

  const fetchCategories = async () => {
    try {
      const response = await WorkerApi.getAllCategories();
      setCategories(response.content);
    } catch (error) {
      console.error("Erro ao buscar as categorias:", error);
    }
  };

  const fetchWorkersByCategory = async (categoryName) => {
    try {
      const response = await WorkerApi.getWorkersByCategory(categoryName);
      setWorkers(response.content);
    } catch (error) {
      console.error("Erro ao buscar os trabalhadores:", error);
    }
  };

  const handleNewRating = async (data) => {
    try {
      const ratingData = {
        ...data,
        user: user.user_id,
        worker: selectedWorker,
        rating: rating,
      };
      await WorkerApi.newRating(ratingData);
      setShowThanks(true);
    } catch (error) {
      console.error("Erro durante o registro:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchWorkersByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const comment = watch("comment") || "";
    setCommentLength(comment.length);
  }, [watch("comment")]);

  const handleSetRating = (value) => {
    setRating(value);
  };

  const handleReturnToCategories = () => {
    history.push("/categories");
  };

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-44 w-44" src={Logo} alt="Finder" />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={Perfil}
                              alt=""
                            />
                            <div className="text-sm font-medium leading-none text-gray-400 ml-2">
                              {user?.name}
                            </div>
                          </Menu.Button>
                        </div>
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  onClick={item.onClick}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="md:hidden">
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={Perfil}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user && user.nome}
                      </div>
                    </div>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        {!showThanks ? (
          <div className="">
            <header className="bg-white shadow mt-10 text-center border-b-0">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-green-600 mb-4 border-none">
                  Quer avaliar um de nossos colaboradores?
                </h1>
                <p className="text-lg text-gray-500 mb-8 border-none">
                  Abaixo preencha todos os campos, fornecendo o máximo possível
                  de detalhes.
                </p>
              </div>
            </header>
            <main>
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <form
                  onSubmit={handleSubmit(handleNewRating)}
                  className="space-y-6"
                >
                  <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="mb-4">
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Escolha uma categoria:
                      </label>
                      <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-4 mt-1 w-full"
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="worker"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Escolha um trabalhador:
                      </label>
                      <select
                        id="worker"
                        onChange={(e) => {
                          setSelectedWorker(e.target.value);
                        }}
                        className="border border-gray-300 rounded-md py-2 px-4 mt-1 w-full"
                      >
                        <option value="">Selecione um trabalhador</option>
                        {workers.map((worker) => (
                          <option
                            key={worker.worker_id}
                            value={worker.worker_id}
                          >
                            {worker.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="rating"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Avaliação:
                      </label>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            required
                            className={classNames(
                              value <= rating
                                ? "text-yellow-400"
                                : "text-gray-300",
                              "mx-1 hover:text-yellow-400 focus:outline-none"
                            )}
                            onClick={() => handleSetRating(value)}
                          >
                            <svg
                              className="h-8 w-8 fill-current"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l2.5 6.5H22l-5 4.1 1.9 6.9-5.8-4.4-5.8 4.4 1.9-6.9-5-4.1h7.5z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4 relative">
                      <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Comentário:
                      </label>
                      <textarea
                        {...register("comment")}
                        id="comment"
                        name="comment"
                        rows="4"
                        maxLength="500"
                        required
                        className="border border-gray-300 rounded-md py-2 px-4 mt-1 w-full"
                      ></textarea>
                      <p className="absolute bottom-1 right-1 text-sm text-gray-500 mb-2 mr-2">
                        {commentLength}/{500} caracteres
                      </p>
                    </div>
                    <div className="flex justify-center mt-8">
                      <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                      >
                        Enviar avaliação
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </main>
          </div>
        ) : (
          <div className="mt-14 text-center border-b-0">
            <h1 className="text-3xl font-bold text-green-600 mb-4 border-none">
              Obrigado por enviar sua avaliação!
            </h1>
            <p className="text-lg text-gray-500 mb-8 border-none">
              Sua contribuição é muito valiosa para nós.
            </p>
            <button
              onClick={handleReturnToCategories}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md mt-2"
            >
              Voltar para as categorias
            </button>
          </div>
        )}
      </div>
    </>
  );
}
