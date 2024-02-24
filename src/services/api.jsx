import axiosInstance from "./axiosConfig";

const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get("/category/findAll");
    return response.data;
  } catch (error) {
    console.error("Erro durante a exibição:", error);
  }
};

const getWorkersByCategory = async (categoryName, page, size) => {
  try {
    const response = await axiosInstance.get("workers/findWorker", {
      params: { categoryName, page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os trabalhadores:", error);
  }
};

const workerRegister = async (data) => {
  try {
    await axiosInstance.post("/workers/newWorker", data);
    history.push("/home");
  } catch (error) {
    console.error("Erro durante o registro:", error);
  }
};

const WorkerApi = {
  getAllCategories,
  getWorkersByCategory,
  workerRegister,
};

export default WorkerApi;
