import { Request, Response } from 'express';
import NamedList, { INamedList } from '../models/NamedList';

export const getNamedLists = async (req: Request, res: Response) => {
  try {
    const namedLists = await NamedList.find().populate('cities');
    res.json(namedLists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching named lists', error });
  }
};

export const createNamedList = async (req: Request, res: Response) => {
  try {
    const { name, shortName, cities, color } = req.body;
    const newNamedList = new NamedList({ name, shortName, cities, color });
    const savedNamedList = await newNamedList.save();
    res.status(201).json(savedNamedList);
  } catch (error) {
    res.status(400).json({ message: 'Error creating named list', error });
  }
};

export const updateNamedList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, shortName, cities, color } = req.body;
    const updatedNamedList = await NamedList.findByIdAndUpdate(id, { name, shortName, cities, color }, { new: true });
    if (!updatedNamedList) {
      return res.status(404).json({ message: 'Named list not found' });
    }
    res.json(updatedNamedList);
  } catch (error) {
    res.status(400).json({ message: 'Error updating named list', error });
  }
};

export const deleteNamedList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedNamedList = await NamedList.findByIdAndDelete(id);
    if (!deletedNamedList) {
      return res.status(404).json({ message: 'Named list not found' });
    }
    res.json({ id });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting named list', error });
  }
};
