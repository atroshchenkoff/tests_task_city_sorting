import { Request, Response } from 'express';
import City, { ICity } from '../models/City';

export const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities', error });
  }
};

export const addCity = async (req: Request, res: Response) => {
  try {
    const { name, foundationDate } = req.body;
    const newCity = new City({ name, foundationDate });
    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (error) {
    res.status(400).json({ message: 'Error adding city', error });
  }
};

export const updateCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, foundationDate } = req.body;
    const updatedCity = await City.findByIdAndUpdate(id, { name, foundationDate }, { new: true });
    if (!updatedCity) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json(updatedCity);
  } catch (error) {
    res.status(400).json({ message: 'Error updating city', error });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCity = await City.findByIdAndDelete(id);
    if (!deletedCity) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting city', error });
  }
};
