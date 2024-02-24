import React from "react";
import { Disclosure } from "@headlessui/react";
import Logo from "../assets/Logo.png";
import Trabalhadores from "../assets/Trabalhadores.png";

const navigation = [
  { name: "Home", href: "/home", current: true },
  { name: "Categorias", href: "/categories", current: false },
  { name: "Avalie", href: "/rating", current: false },
  { name: "Faça parte do nosso time", href: "/workerRegister", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const userNavigation = [{ name: "Sair", href: "/" }];

export default function Home() {
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
                  <div className="flex items-center">
                    <a
                      href="/login"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Entrar
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2">
                <h1 className="text-4xl font-bold text-gray-800">
                  Encontre quem você precisa com apenas alguns cliques!
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  Uma vasta variedade de profissionais altamente capacitados, de
                  diversos ramos e segmentos, prontos para a sua necessidade.
                </p>
                <div className="mt-8">
                  <p className="mt-4 text-lg text-gray-600">
                    Faça login para visualizar as categorias e profissionais que
                    temos disponíveis.
                  </p>
                  <a
                    href="/login"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 mr-4 rounded mt-6"
                  >
                    Entrar
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <img
                  src={Trabalhadores}
                  alt="Trabalhadores"
                  className="mx-auto rounded-lg w-full md:w-auto"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
