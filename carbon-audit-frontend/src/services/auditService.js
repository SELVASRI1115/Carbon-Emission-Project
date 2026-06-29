import api from "../utils/axiosConfig";

export const getPendingRecords = async () => {

  const response =
    await api.get(
      "/audit/pending"
    );

  return response.data;
};

export const getAllAudits = async () => {

  const response =
    await api.get(
      "/audit/all"
    );

  return response.data;
};

export const approveRecord =
  async (
    auditId,
    auditData
  ) => {

    const response =
      await api.put(
        `/audit/approve/${auditId}`,
        auditData
      );

    return response.data;
  };

export const rejectRecord =
  async (
    auditId,
    auditData
  ) => {

    const response =
      await api.put(
        `/audit/reject/${auditId}`,
        auditData
      );

    return response.data;
  };

const auditService = {

  getPendingRecords,

  getAllAudits,

  approveRecord,

  rejectRecord

};

export default auditService;