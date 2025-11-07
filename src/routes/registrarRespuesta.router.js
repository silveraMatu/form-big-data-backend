// src/routes/encuesta.routes.js
import { Router } from 'express';
import { registrarRespuesta } from '../controllers/encuesta.controller.js';
import { obtenerDatosConsolidados } from '../controllers/extract.controller.js';

const router = Router();

// Define la ruta POST
router.post('/', registrarRespuesta);
router.get('/datos-bi', obtenerDatosConsolidados);

export default router;