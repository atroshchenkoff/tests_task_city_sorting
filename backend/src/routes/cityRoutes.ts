import express from 'express';
import { getCities, addCity, updateCity, deleteCity } from '../controllers/cityController';

const router = express.Router();

router.get('/', getCities);
router.post('/', addCity);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);

export default router;
