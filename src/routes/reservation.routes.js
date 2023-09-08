import { Router } from 'express';
import { createReservation } from '../controllers/index.js';

const router = Router();

router.post('/', createReservation);


export default router;