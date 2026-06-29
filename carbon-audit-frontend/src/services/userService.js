import api from "../utils/axiosConfig";

export const getAllUsers = async () => {

  const response =
    await api.get(
      "/users"
    );

  return response.data;
};

export const getUserById = async (
  id
) => {

  const response =
    await api.get(
      `/users/${id}`
    );

  return response.data;
};

export const updateUser = async (
  id,
  userData
) => {

  const response =
    await api.put(
      `/users/${id}`,
      userData
    );

  return response.data;
};

export const deleteUser = async (
  id
) => {

  const response =
    await api.delete(
      `/users/${id}`
    );

  return response.data;
};

const userService = {

  getAllUsers,

  getUserById,

  updateUser,

  deleteUser

};

export default userService;