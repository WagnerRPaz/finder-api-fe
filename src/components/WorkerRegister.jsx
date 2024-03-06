import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Disclosure, Menu } from "@headlessui/react";
import Logo from "../assets/Logo.png";
import Perfil from "../assets/Perfil.png";
import { AuthContext, useAuth } from "../contexts/AuthContext";
import WorkerApi from "../services/api";

const navigation = [
  { name: "Home", href: "/home", current: false },
  { name: "Categorias", href: "/categories", current: false },
  { name: "Avalie", href: "/rating", current: false },
  { name: "Faça parte do nosso time", href: "/workerRegister", current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  return cpf;
}

function formatPhone(phone) {
  phone = phone.replace(/\D/g, "");
  phone = phone.replace(/^(\d{2})(\d)/g, "($1) $2");

  return phone;
}

export default function WorkerRegister() {
  const { register, handleSubmit, watch } = useForm();
  const { signOut } = useContext(AuthContext);
  const { user } = useAuth();
  const [formattedCPF, setFormattedCPF] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [categories, setCategories] = useState([]);
  const [summaryLength, setSummaryLength] = useState(0);
  const [formattedBirthDate, setFormattedBirthDate] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const history = useHistory();

  const handleSignOut = async () => {
    signOut();
  };

  const userNavigation = [{ name: "Sair", href: "/", onClick: handleSignOut }];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await WorkerApi.getAllCategories();
        setCategories(response.content);
      } catch (error) {
        console.error("Erro ao buscar as categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  const HandleWorkerRegister = async (data) => {
    try {
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("cpf", data.cpf);
      formData.append("birth_date", data.birth_date);
      formData.append("categoryName", data.categoryName);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("city", data.city);
      formData.append("summary", data.summary);
      formData.append("experience", data.experience);
      formData.append("photoFile", photoFile);
      await WorkerApi.workerRegister(formData);
      history.push("/thanks");
    } catch (error) {
      console.error("Erro durante o registro:", error);
    }
  };

  useEffect(() => {
    const summary = watch("summary") || "";
    setSummaryLength(summary.length);
  }, [watch("summary")]);

  const handleCPFChange = (e) => {
    setFormattedCPF(formatCPF(e.target.value));
  };

  const handlePhoneChange = (e) => {
    setFormattedPhone(formatPhone(e.target.value));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    setSelectedFileName(file ? file.name : "");
  };

  const handleBirthDateChange = (e) => {
    const inputDate = e.target.value.replace(/\D/g, '');
    const day = inputDate.slice(0, 2);
    const month = inputDate.slice(2, 4);
    const year = inputDate.slice(4, 8);

    let formattedDate = "";
    if (inputDate.length <= 8) {
      formattedDate = `${day}${day.length < 2 ? '' : '/'}${month}${month.length < 2 ? '' : '/'}${year}`;
    }
    setFormattedBirthDate(formattedDate);
  };

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {() => (
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
        <header className="bg-white shadow mt-10 text-center border-b-0">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-green-600 mb-4 border-none">
              Venha fazer parte você também!
            </h1>
            <p className="text-lg text-gray-500 mb-8 border-none">
              Preencha todos os campos abaixo, o restante deixa com a gente. 😉
            </p>
          </div>
        </header>
        <main>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl md:flex md:flex-row md:space-x-4">
              <div className="md:w-1/3">
                <form
                  className="border rounded-lg p-4 w-72 h-72"
                  action="#"
                  method="POST"
                  onSubmit={handleSubmit(HandleWorkerRegister)}
                >
                  <h2 className="text-xl font-bold text-green-600 mb-4">
                    1. Informações Pessoais
                  </h2>

                  <div className="grid grid-cols-1 gap-y-4">
                    <div>
                      <label
                        htmlFor="full_name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Nome Completo
                      </label>
                      <input
                        {...register("full_name", { required: true })}
                        id="full_name"
                        name="full_name"
                        type="text"
                        autoComplete="full_name"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cpf"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        CPF
                      </label>
                      <input
                        {...register("cpf", { required: true })}
                        value={formattedCPF}
                        onChange={handleCPFChange}
                        id="cpf"
                        name="cpf"
                        type="text"
                        autoComplete="cpf"
                        maxLength="14"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="birth_date"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Data de Nascimento
                      </label>
                      <input
                        {...register("birth_date", { required: true })}
                        id="birth_date"
                        name="birth_date"
                        type="text"
                        value={formattedBirthDate}
                        onChange={handleBirthDateChange}
                        autoComplete="birth_date"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="md:w-1/3">
                <form
                  className="border rounded-lg p-4 w-72 h-72"
                  action="#"
                  method="POST"
                  onSubmit={handleSubmit(HandleWorkerRegister)}
                >
                  <h2 className="text-xl font-bold text-green-600 mb-4">
                    2. Informações de Contato
                  </h2>
                  <div className="grid grid-cols-1 gap-y-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Telefone
                      </label>
                      <input
                        {...register("phone", { required: true })}
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formattedPhone}
                        onChange={handlePhoneChange}
                        autoComplete="phone"
                        maxLength="14"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        E-mail
                      </label>
                      <input
                        {...register("email", { required: true })}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <div className="flex items-center">
                        <label
                          htmlFor="photoFile"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Foto de Perfil
                          <span className="text-sm text-gray-500 ml-3">
                            {selectedFileName && selectedFileName.length > 19
                              ? selectedFileName.substring(0, 19) + "..."
                              : selectedFileName}
                          </span>
                        </label>
                      </div>
                      <label
                        htmlFor="photoFile"
                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 h-9 cursor-pointer ml-0 px-4 bg-green-600 hover:bg-green-700"
                      >
                        Selecionar Imagem
                      </label>
                      <input
                        {...register("photoFile", { required: true })}
                        id="photoFile"
                        name="photoFile"
                        type="file"
                        autoComplete="photoFile"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="md:w-1/3">
                <form
                  className="border rounded-lg p-4 w-72 h-72"
                  action="#"
                  method="POST"
                  onSubmit={handleSubmit(HandleWorkerRegister)}
                >
                  <h2 className="text-xl font-bold text-green-600 mb-4">
                    3. Detalhes Profissionais
                  </h2>

                  <div className="grid grid-cols-1 gap-y-4">
                    <div>
                      <label
                        htmlFor="categoryName"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Profissão
                      </label>
                      <select
                        {...register("categoryName", { required: true })}
                        id="categoryName"
                        name="categoryName"
                        autoComplete="categoryName"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                      >
                        <option value="">Selecione uma profissão</option>
                        {categories &&
                          categories.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Anos de Experiência
                      </label>
                      <input
                        {...register("experience", { required: true })}
                        id="experience"
                        name="experience"
                        type="number"
                        autoComplete="experience"
                        min="0"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Cidade e Estado de Atuação
                      </label>
                      <input
                        {...register("city", { required: true })}
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="city"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl md:w-2/3">
              <form
                className="border rounded-lg p-4"
                action="#"
                method="POST"
                onSubmit={handleSubmit(HandleWorkerRegister)}
              >
                <h2 className="text-xl font-bold text-green-600 mb-4">
                  4. Resumo Profissional
                </h2>
                <div className="relative mt-1">
                  <textarea
                    {...register("summary")}
                    id="summary"
                    name="summary"
                    autoComplete="summary"
                    required
                    rows="6"
                    maxLength="1000"
                    placeholder="Hora de vender teu peixe."
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 resize-none"
                  ></textarea>
                  <p className="absolute bottom-1 right-1 text-sm text-gray-500 mb-2 mr-2">
                    {summaryLength}/{1000} caracteres
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
