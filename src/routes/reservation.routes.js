import { Router } from 'express';
import { createReservation, cancelReservation, getCurrentOccupancy} from '../controllers/index.js';

const router = Router();

router.get('/', getCurrentOccupancy);

router.post('/', createReservation);

router.patch('/:id', cancelReservation);


export default router;