import { Router } from 'express';
import { createOneSpot, createMultipleSpots } from '../controllers/index.js';

const router = Router();

router.post('/', createOneSpot);

router.post('/:numSpots', createMultipleSpots);

export default router;