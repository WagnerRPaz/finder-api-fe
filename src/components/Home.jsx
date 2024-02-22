import React, { Fragment, useContext, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../assets/Logo.png";
import Perfil from "../assets/Perfil.png";
import { AuthContext, useAuth } from "../contexts/AuthContext";
import HomeApi from "../services/api";
import Pagination from "@mui/material/Pagination";

const navigation = [
  { name: "Home", href: "/home", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];

// Descrições das categorias
const categoryDescriptions = {
  Carpinteiro:
    "Profissional responsável por construir e reparar estruturas e outros objetos compostos por madeira. Em sua atuação, eles cortam, lixam, montam e instalam móveis e outros materiais.",
  Eletricista:
    "Profissional responsável pela implementação, manutenção e reparação de instalações elétricas, tanto residenciais quanto industriais.",
  Encanador:
    "Profissional responsável por instalar e prover a manutenção de sistemas hidráulicos (água e esgoto) de residências, estabelecimentos e indústrias.",
  Faxineiro:
    "Profissional responsável por realizar a limpeza e a conservação de ambientes, sejam eles residenciais, comerciais, industriais ou públicos.",
  Pedreiro:
    "Profissional responsável pela execução de atividades de construção e manutenção de edifícios, casas, estruturas e obras em geral.",
  Pintor:
    "Profissional responsável por utilizar técnicas de pintura para aplicar tintas em superfícies, com o objetivo de criar efeitos estéticos e/ou proteger e preservar os materiais.",
  Babá: "Profissional que cuida de bebês e crianças, zelando pelo bem-estar, saúde, alimentação, higiene pessoal, educação, cultura, recreação e lazer.",
  Cozinheiro:
    "Profissional responsável por preparar pratos, atentando para as especificações da comanda ou cardápio.",
  Jardineiro:
    "Profissional responsável pela implantação, criação e manutenção de jardins, poda de árvores, cuidado de flores de ambiente interno e externo e corte de grama.",
  "Marido de aluguel":
    "Profissional responsável por fazer pequenos consertos e reparos em residências.",
  "Instalação de eletrônicos":
    "Profissional responsável pela instalação, manutenção e reparo de dispositivos eletrônicos.",
  Vidraceiro:
    "Profissional responsável pela instalação, reparo e manutenção de produtos de vidro.",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const { signOut } = useContext(AuthContext);
  const { user, fetchData } = useAuth();
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await HomeApi.getAllCategories(page, 6);
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
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-21 w-21"
                        src={Logo}
                        alt="Your Company"
                      />
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
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
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
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
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
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
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
            ) : (
              <>
                <ul className="grid grid-cols-2 gap-4">
                  {categories
                    .map((category) => (
                      <li
                        key={category.id}
                        className="bg-white border rounded-lg p-4 shadow-sm"
                      >
                        <p className="text-lg font-semibold text-green-600 mb-2">
                          {category.name}
                        </p>
                        <p className="text-gray-500">
                          {categoryDescriptions[category.name] ||
                            "Descrição não disponível"}
                        </p>
                      </li>
                    ))
                    .slice(page * 6, (page + 1) * 6)}
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
