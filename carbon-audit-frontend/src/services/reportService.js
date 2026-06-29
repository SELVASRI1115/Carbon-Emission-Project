import api from "../utils/axiosConfig";

export const getAllReports = async () => {

    const response =
        await api.get(
            "/reports"
        );

    return response.data;
};

export const generateReport = async (reportData) => {

    const response =
        await api.post(
            "/reports/generate",
            reportData
        );

    return response.data;
};

const reportService = {

    getAllReports,
    generateReport

};

export default reportService;