import express from 'express';
import { getNamedLists, createNamedList, updateNamedList, deleteNamedList } from '../controllers/namedListController';

const router = express.Router();

router.get('/', getNamedLists);
router.post('/', createNamedList);
router.put('/:id', updateNamedList);
router.delete('/:id', deleteNamedList);

export default router;
