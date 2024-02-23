import React, { Fragment, useContext, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MailIcon, CalendarIcon, PhoneIcon } from "@heroicons/react/solid";
import Logo from "../assets/Logo.png";
import Perfil from "../assets/Perfil.png";
import { AuthContext, useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import HomeApi from "../services/api";
import Pagination from "@mui/material/Pagination";

const navigation = [
  { name: "Home", href: "/home", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function WorkerList() {
  const { signOut } = useContext(AuthContext);
  const { user } = useAuth();
  const { categoryName } = useParams();
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchWorkersByCategory = async () => {
      setIsLoading(true);
      try {
        const response = await HomeApi.getWorkersByCategory(categoryName);
        setWorkers(response.content);
        setTotalPages(Math.ceil(response.totalElements / 6));
      } catch (error) {
        console.error("Erro ao buscar os trabalhadores:", error);
      }
      setIsLoading(false);
    };

    fetchWorkersByCategory();
  }, [categoryName]);

  const handleSignOut = async () => {
    signOut();
  };

  const userNavigation = [{ name: "Sair", href: "/", onClick: handleSignOut }];

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const openModal = (worker) => {
    setSelectedWorker(worker);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
            <h1 className="text-3xl font-bold text-green-600 mb-2 border-none">
              Profissionais da categoria {categoryName}
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-7xl sm:px-6 lg:px-8 compact-subtitle">
              Os profissionais presentes em nosso site são altamente
              capacitados, escolhidos criteriosamente para integrarem nossas
              listas. Priorizamos a excelência e expertise, assegurando que
              apenas os melhores sejam apresentados aos nossos usuários.
            </p>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {isLoading ? (
              <p className="text-center">Carregando...</p>
            ) : workers.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-white rounded-lg p-8 text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Nenhum trabalhador encontrado para a categoria{" "}
                    {categoryName}
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
                  {workers
                    .map((worker) => (
                      <li
                        key={worker.worker_id}
                        className="bg-white border rounded-lg p-4 shadow-sm cursor-pointer transition duration-300 hover:bg-gray-100 worker-card"
                      >
                        <div>
                          <h1 className="text-lg font-semibold text-green-600 mb-2">
                            {worker.full_name}
                          </h1>
                          <div className="flex items-center text-gray-500">
                            <CalendarIcon className="h-5 w-5 mr-1" />
                            <p>{worker.experience} anos de experiência</p>
                          </div>
                          <p className="text-gray-500 mt-10">
                            {worker.summary}
                          </p>
                          <button
                            onClick={() => openModal(worker)}
                            className="mt-10 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                          >
                            Entre em contato
                          </button>
                        </div>
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
      {/* Modal */}
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"></div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Entre em contato com{" "}
                      {selectedWorker && selectedWorker.full_name}
                    </h3>
                    <p className="text-gray-600 mt-2 mb-4"></p>
                    <div className="flex items-center text-gray-600 mt-2 mb-4">
                      <MailIcon className="h-5 w-5 mr-1" />
                      <p>{selectedWorker && selectedWorker.email}</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="h-5 w-5 mr-1" />
                      <p>{selectedWorker && selectedWorker.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={closeModal}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Fechar
                </button>
                {/* Add submit button or additional actions */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
