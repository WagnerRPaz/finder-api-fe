import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Logo from "../assets/Logo.png";
import Perfil from "../assets/Perfil.png";
import { AuthContext, useAuth } from "../contexts/AuthContext";
import WorkerApi from "../services/api";
import Pagination from "@mui/material/Pagination";

const navigation = [
  { name: "Home", href: "/home", current: false },
  { name: "Categorias", href: "#", current: true },
  { name: "Avalie", href: "/rating", current: false },
  { name: "Faça parte do nosso time", href: "/workerRegister", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const { signOut } = useContext(AuthContext);
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await WorkerApi.getAllCategories(page, 6);
        setCategories(response.content);
        setTotalPages(Math.ceil(response.totalElements / 6));
      } catch (error) {
        console.error("Erro ao buscar as categorias:", error);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, [page]);

  const handleSignOut = async () => {
    signOut();
  };

  const userNavigation = [{ name: "Sair", href: "/", onClick: handleSignOut }];

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({}) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-21 w-21" src={Logo} alt="Finder" />
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
                              {user?.nome}
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
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {user && user.email}
                      </div>
                    </div>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <header className="bg-white shadow text-center border-b-0">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-green-600 mb-4 border-none">
              Encontre aqui o melhor profissional para você
            </h1>
            <p className="text-lg text-gray-500 mb-8 border-none">
              Abaixo selecione a área de trabalho que deseja contratar
            </p>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {isLoading ? (
              <p className="text-center">Carregando...</p>
            ) : categories.length === 0 ? (
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 flex items-center justify-center h-full">
                <div className="bg-white border rounded-lg p-8 shadow-sm text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Nenhum trabalhador encontrado para esta categoria
                  </h2>
                  <p className="text-gray-500">
                    Infelizmente, não há trabalhadores disponíveis para a
                    categoria selecionada no momento. Por favor, tente novamente
                    mais tarde ou escolha uma categoria diferente.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <ul className="grid grid-cols-2 gap-4">
                  {categories
                    .slice(page * 6, (page + 1) * 6)
                    .map((category) => (
                      <li
                        key={category.id}
                        className="bg-white border rounded-lg p-4 shadow-sm cursor-pointer transition duration-300 hover:bg-gray-100"
                        onClick={() =>
                          history.push(`/workers/${category.name}`)
                        }
                      >
                        <div>
                          <h2 className="text-lg font-semibold text-green-600 mb-2">
                            {category.name}
                          </h2>
                          <p className="text-gray-500">
                            {category.description || "Descrição não disponível"}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
                <div className="flex justify-center mt-4">
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
