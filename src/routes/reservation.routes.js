import { Router } from 'express';
import { check } from 'express-validator';
import { findReservationByPk, createReservation, cancelReservation, getCurrentOccupancy} from '../controllers/index.js';
import { validateJWT, validateFields, hasRole } from '../middlewares/index.js';

const router = Router();

router.get('/', [
    validateJWT,
    hasRole('ADMIN', 'EMPLOYEE'),
    validateFields
], getCurrentOccupancy);

router.get('/:id', [
    validateJWT,
    validateFields
], findReservationByPk);

router.post('/', [
    validateJWT,
    check('startDateTime', 'reservation startDateTime is required!').not().isEmpty(),
    check('endDateTime', 'reservation endDateTime is required!').not().isEmpty(),
    validateFields
], createReservation);

router.patch('/:id', [
    validateJWT,
    validateFields
], cancelReservation);


export default router;