import { Router } from 'express';
import { getJoyas, getJoyasByFilters } from '../controllers/JoyasController.js';

const router = Router();

router.get('/joyas', getJoyas);
router.get('/joyas/filtros', getJoyasByFilters);

export default router;