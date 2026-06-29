import api from "../utils/axiosConfig";

export const getAllCategories = async () => {

    const response =
        await api.get("/categories");

    return response.data;
};

export const addCategory = async (data) => {

    const response =
        await api.post(
            "/categories",
            data
        );

    return response.data;
};

const categoryService = {

    getAllCategories,
    addCategory

};

export default categoryService;