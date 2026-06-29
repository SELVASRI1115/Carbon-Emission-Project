import api from "../utils/axiosConfig";

export const getAllEmissions = async () => {

    const response =
        await api.get(
            "/emissions"
        );

    return response.data;
};

export const getMyEmissions = async () => {

    const response =
        await api.get(
            "/emissions/my"
        );

    return response.data;
};

export const addEmission = async (
    emissionData
) => {

    const response =
        await api.post(
            "/emissions",
            emissionData
        );

    return response.data;
};

export const updateEmission = async (
    id,
    emissionData
) => {

    const response =
        await api.put(
            `/emissions/${id}`,
            emissionData
        );

    return response.data;
};

export const deleteEmission = async (
    id
) => {

    const response =
        await api.delete(
            `/emissions/${id}`
        );

    return response.data;
};

export const getAllCategories = async () => {

    const response =
        await api.get(
            "/categories"
        );

    return response.data;
};

const emissionService = {

    getAllEmissions,
    getMyEmissions,
    addEmission,
    updateEmission,
    deleteEmission,
    getAllCategories

};

export default emissionService;