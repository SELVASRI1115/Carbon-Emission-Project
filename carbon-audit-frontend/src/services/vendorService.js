import api from "../utils/axiosConfig";

export const getAllVendors = async () => {

  const response = await api.get(
    "/vendors"
  );

  return response.data;
};

export const addVendor = async (
  vendorData
) => {

  const response = await api.post(
    "/vendors",
    vendorData
  );

  return response.data;
};

export const deleteVendor = async (
  id
) => {

  const response = await api.delete(
    `/vendors/${id}`
  );

  return response.data;
};

const vendorService = {

  getAllVendors,

  addVendor,

  deleteVendor

};

export default vendorService;