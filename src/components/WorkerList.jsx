import React, { useContext, useEffect, useState } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { MailIcon, CalendarIcon, PhoneIcon, LocationMarkerIcon, SearchIcon, StarIcon, } from "@heroicons/react/solid";
import Logo from "../assets/Logo.png";
import Perfil from "../assets/Perfil.png";
import { AuthContext, useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import WorkerApi from "../services/api";
import Pagination from "@mui/material/Pagination";

const navigation = [
  { name: "Home", href: "/home", current: false },
  { name: "Categorias", href: "/categories", current: false },
  { name: "Avalie", href: "/rating", current: false },
  { name: "Faça parte do nosso time", href: "/workerRegister", current: false },
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [workerId, setWorkerId] = useState("");
  const [statusFilter, setStatusFilter] = useState("ACCEPTED");

  useEffect(() => {
    const fetchWorkersByCategory = async () => {
      setIsLoading(true);
      try {
        const response = await WorkerApi.getWorkersByCategory(categoryName);
        let filteredWorkers = [];
        if (statusFilter === "ACCEPTED") {
          filteredWorkers = response.content.filter(
            (worker) => worker.status === "ACCEPTED"
          );
        } else if (statusFilter === "PENDING") {
          filteredWorkers = response.content.filter(
            (worker) => worker.status === "PENDING"
          );
        } else {
          filteredWorkers = response.content;
        }
        const workersWithReviews = await Promise.all(
          filteredWorkers.map(async (worker) => {
            const reviewsResponse = await WorkerApi.getWorkerReviews(
              worker.worker_id
            );
            return { ...worker, reviews: reviewsResponse };
          })
        );
        setWorkers(workersWithReviews);
        setFilteredWorkers(workersWithReviews);
        setTotalPages(Math.ceil(response.totalElements / 6));
      } catch (error) {
        console.error("Erro ao buscar os trabalhadores:", error);
      }
      setIsLoading(false);
    };

    fetchWorkersByCategory();
  }, [categoryName, statusFilter]);

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const filtered = workers.filter((worker) =>
      worker.full_name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredWorkers(filtered);
  };

  const isAdmin = () => {
    return user && user.role === "ADMIN";
  };

  const handleAcceptWorker = async (workerId) => {
    try {
      await WorkerApi.acceptWorker(workerId);
    } catch (error) {
      console.error("Erro ao aceitar trabalhador:", error);
    }
  };

  const handleWorkerIdChange = (e) => {
    setWorkerId(e.target.value);
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
                      <img className="h-44 w-44" src={Logo} alt="Finder" />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4 ">
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
                  <div className="hidden md:block ">
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
        <header className="bg-white shadow  mt-10 text-center border-b-0">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-green-600 mb-2">
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
            <div className="relative max-w-full mx-auto mb-6 flex justify-between items-center mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-1/2 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Buscar profissionais..."
              />
              {isAdmin() && (
                <>
                  <input
                    value={workerId}
                    onChange={handleWorkerIdChange}
                    placeholder="Digite o ID do trabalhador"
                    className="block w-48 pl-2 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                  <button
                    onClick={() => handleAcceptWorker(workerId)}
                    className="block w-36 pl-2 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    Aceitar Trabalhador
                  </button>

                  <label
                    htmlFor="statusFilter"
                    className="block w-32 pl-2 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 sm:text-sm"
                  >
                    Filtrar por status:
                  </label>
                  <select
                    id="statusFilter"
                    className=" block rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="ACCEPTED">Aceito</option>
                    <option value="PENDING">Pendente</option>
                  </select>
                </>
              )}
            </div>

            {isLoading ? (
              <p className="text-center">Carregando...</p>
            ) : filteredWorkers.length === 0 ? (
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
                <ul className="worker-grid md:grid-cols-3 gap-4">
                  {filteredWorkers
                    .map((worker) => (
                      <li
                        key={worker.worker_id}
                        className="worker-card bg-white border rounded-lg p-4 shadow-sm transition duration-300 flex flex-col justify-between"
                      >
                        <div className="flex justify-between md:flex-row md:grid-cols-2 mb-4">
                          <div className="flex flex-col">
                            <h1 className="text-2xl font-semibold text-green-600 mb-2">
                              {worker.full_name}
                            </h1>
                            <div className="flex items-center text-gray-500 mt-2">
                              <StarIcon className="h-5 w-5 mr-1" />
                              <p>
                                {worker.reviews.averageRating.toFixed(1)} •{" "}
                                {worker.reviews.totalReviews} avaliações
                              </p>
                            </div>
                            <div className="flex items-center text-gray-500 mt-1">
                              <LocationMarkerIcon className="h-5 w-5 mr-1" />
                              <p>{worker.city}</p>
                            </div>
                            <div className="flex items-center text-gray-500 mt-1">
                              <CalendarIcon className="h-5 w-5 mr-1" />
                              <p>{worker.experience} anos de experiência</p>
                            </div>
                          </div>
                          {worker.photoBase64 && (
                            <img
                              src={`data:image/${worker.photoMimeType};base64,${worker.photoBase64}`}
                              alt="Worker Photo"
                              className="flex h-12 w-12 md:h-20 md:w-20 lg:h-24 lg:w-24 rounded-full"
                            />
                          )}
                        </div>
                        <div className="text-gray-500 mb-4 max-h-16 overflow-hidden">
                          {worker.summary.length > 80 ? (
                            <>
                              {worker.summary.substring(0, 80)}{" "}
                              <span
                                className="text-green-600 cursor-pointer"
                                onClick={() => openModal(worker)}
                              >
                                Ver mais...
                              </span>
                            </>
                          ) : (
                            worker.summary
                          )}
                        </div>
                        <div className="text-center">
                          <button
                            onClick={() => openModal(worker)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
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
                <div className="sm:items-start">
                  <div className="flex justify-between md:flex-row md:grid-cols-2 mb-4">
                    <div className="mt-3 text-center sm:mt-0  sm:text-left">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-headline"
                      >
                        Entre em contato com{" "}
                        {selectedWorker && selectedWorker.full_name}
                      </h3>
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-600 mb-2 mt-4">
                          <MailIcon className="h-5 w-5 mr-1" />
                          <p>{selectedWorker && selectedWorker.email}</p>
                        </div>
                        <div className="flex items-center text-gray-600 mb-4">
                          <PhoneIcon className="h-5 w-5 mr-1" />
                          <p>{selectedWorker && selectedWorker.phone}</p>
                        </div>
                      </div>
                    </div>
                    {selectedWorker && selectedWorker.photoBase64 && (
                      <img
                        src={`data:image/${selectedWorker.photoMimeType};base64,${selectedWorker.photoBase64}`}
                        alt="Worker Photo"
                        className="h-28 w-28 rounded-full"
                      />
                    )}
                  </div>
                  <div className="text-gray-600 max-h-40 overflow-y-auto px-4 py-2 rounded-md border border-gray-300">
                    <p className="whitespace-pre-line">
                      {selectedWorker && selectedWorker.summary}
                    </p>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
