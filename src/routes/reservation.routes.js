import { Router } from 'express';
import { createReservation, cancelReservation, getCurrentOccupancy} from '../controllers/index.js';
import { validateJWT, validateFields, hasRole } from '../middlewares/index.js';

const router = Router();

router.get('/', [
    validateJWT,
    hasRole('ADMIN', 'EMPLOYEE'),
    validateFields
], getCurrentOccupancy);

router.post('/', createReservation);

router.patch('/:id', cancelReservation);


export default router;