import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT, validateFields, hasRole, validateOwner } from '../middlewares/index.js';
import {  
    createReservation, 
    cancelReservation, 
    getCurrentOccupancy, 
    checkInOut
} from '../controllers/index.js';


const router = Router();

router.get('/', [
    validateJWT,
    hasRole('ADMIN', 'EMPLOYEE'),
    validateFields
], getCurrentOccupancy);

router.post('/', [
    validateJWT,
    check('startDateTime', 'reservation startDateTime is required!').not().isEmpty(),
    check('endDateTime', 'reservation endDateTime is required!').not().isEmpty(),
    validateFields
], createReservation);

router.patch('/:id', [
    validateJWT,
    validateOwner,
    validateFields
], cancelReservation);

router.patch('/:action/:id', [
    validateJWT,
    hasRole('ADMIN', 'CLIENT'),
    validateFields
], checkInOut);


export default router;