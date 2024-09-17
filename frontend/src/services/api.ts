import axios from 'axios';
import { City } from '../machines/citiesMachine';
import { NamedList } from '../machines/namedListMachine';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const cityRoute = '/cities'
export const getCities = () => api.get<City[]>('/cities');
export const addCity = (city: Omit<City, '_id'>) => api.post(cityRoute, city);
export const updateCity = (id: string, city: Omit<City, '_id'>) => api.put(`${cityRoute}/${id}`, city);
export const deleteCity = (id: string) => api.delete<{ id: string }>(`${cityRoute}/${id}`);

const namedListRoute = '/named-lists'
export const getNamedLists = () => api.get(namedListRoute);
export const createNamedList = (list: Omit<NamedList, '_id'>) => api.post(namedListRoute, list);
export const updateNamedList = (id: string, list: Omit<NamedList, '_id'>) => api.put(`${namedListRoute}/${id}`, list);
export const deleteNamedList = (id: string) => api.delete<{ id: string }>(`${namedListRoute}/${id}`);

export default api;
