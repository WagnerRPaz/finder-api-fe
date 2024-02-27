import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Disclosure, Menu } from "@headlessui/react";
import Logo from "../assets/Logo.png";
import Perfil from "../assets/Perfil.png";
import Thanks from "../assets/Thanks.png";
import { AuthContext, useAuth } from "../contexts/AuthContext";

const navigation = [
  { name: "Home", href: "/home", current: false },
  { name: "Categorias", href: "/categories", current: false },
  { name: "Avalie", href: "/rating", current: false },
  { name: "Faça parte do nosso time", href: "/workerRegister", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const { signOut } = useContext(AuthContext);
  const { user } = useAuth();
  const history = useHistory();

  const handleSignOut = async () => {
    signOut();
  };

  const userNavigation = [{ name: "Sair", href: "/", onClick: handleSignOut }];

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
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center">
            <div className="w-1/2 pr-4">
              <h1 className="text-4xl font-bold text-green-600 mb-4 border-none">
                Ficamos felizes em saber que você deseja fazer parte do nosso
                projeto!
              </h1>
              <p className="text-lg text-gray-500 mb-8 border-none">
                Nossa equipe irá analisar os dados que você preencheu, para que
                assim seu perfil fique visível em nossas listas.
              </p>
              <button
                onClick={() => history.push("/categories")}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
              >
                Voltar para as categorias
              </button>
            </div>
            <div className="w-1/2 pl-4">
              <img
                className="object-cover object-center rounded-lg"
                src={Thanks}
                alt="Thanks"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
