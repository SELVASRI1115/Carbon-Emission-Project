import api from "../utils/axiosConfig";

export const getDashboardSummary =
  async () => {

    const response =
      await api.get(
        "/dashboard/summary"
      );

    return response.data;
  };

const dashboardService = {

  getDashboardSummary

};

export default dashboardService;