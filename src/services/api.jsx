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
  } catch (error) {
    console.error("Erro durante o registro:", error);
  }
};

const getWorkerReviews = async (workerId) => {
  try {
    const response = await axiosInstance.get(`/reviews/stats/${workerId}`);
    return response.data;
  } catch (error) {
    console.error("Erro durante a exibição:", error);
  }
};

const newRating = async (data) => {
  try {
    await axiosInstance.post("/reviews/newReview", data);
  } catch (error) {
    console.error("Erro durante o registro:", error);
  }
};

const acceptWorker = async (workerId) => {
  try {
    await axiosInstance.post(`/workers/acceptWorker/${workerId}`);
    console.log("Trabalhador aceito com sucesso!");
  } catch (error) {
    console.error("Erro ao aceitar trabalhador:", error);
  }
};

const deleteWorker = async (workerId) => {
  try {
    await axiosInstance.delete(`/workers/deleteWorker/${workerId}`);
    console.log("Trabalhador deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar o trabalhador:", error);
  }
};

const WorkerApi = {
  getAllCategories,
  getWorkersByCategory,
  workerRegister,
  getWorkerReviews,
  newRating,
  acceptWorker,
  deleteWorker
};

export default WorkerApi;
