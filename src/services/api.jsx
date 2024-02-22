import axiosInstance from "./axiosConfig";

const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get("/category/findAll");
    return response.data;
  } catch (error) {
    console.error("Erro durante a exibição:", error);
  }
};

const HomeApi = {
  getAllCategories,
};

export default HomeApi;
