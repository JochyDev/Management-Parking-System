import { Router } from 'express';
import { createReservation, cancelReservation, getCurrentOccupancy} from '../controllers/index.js';
import { validateFields } from '../middlewares/validateFields.js';
import { validateJWT } from '../middlewares/validateJWT.js';

const router = Router();

router.get('/', [
    validateJWT,
    validateFields
], getCurrentOccupancy);

router.post('/', createReservation);

router.patch('/:id', cancelReservation);


export default router;