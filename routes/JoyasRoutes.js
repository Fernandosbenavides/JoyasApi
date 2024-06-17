import { Router } from "express";
import {
  getJoyas,
  getJoyasByFilters,
  getJoyasById,
} from "../controllers/JoyasController.js";

const router = Router();

router.get("/joyas", getJoyas);
router.get("/joyas/filtros", getJoyasByFilters);
router.get("/joyas/:id", getJoyasById); //AGREGO RUTA PARA LA ID

export default router;
