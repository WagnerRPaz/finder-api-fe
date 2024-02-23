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

const HomeApi = {
  getAllCategories,
  getWorkersByCategory,
};

export default HomeApi;
