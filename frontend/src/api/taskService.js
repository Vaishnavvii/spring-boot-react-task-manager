import axiosClient from './axiosClient';

export const getAllTasks = async () => {
  const response = await axiosClient.get('/tasks');
  return response.data;
};

export const createTask = async (taskPayload) => {
  const response = await axiosClient.post('/tasks', taskPayload);
  return response.data;
};