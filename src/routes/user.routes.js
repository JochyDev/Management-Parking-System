import { Router } from 'express';
import { check } from 'express-validator';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/index.js';
import { validateJWT, validateFields, hasRole } from '../middlewares/index.js'
import { emailExist } from '../helpers/db-validators.js'

const router = Router();

router.get('/', [
    validateJWT,
    hasRole('ADMIN', 'EMPLOYEE'),
    validateFields
], getUsers);

router.post('/', [
    check('name', 'User Name is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('phone', 'Phone Number is required').not().isEmpty(),
    check('email', 'Email isn\'t valid').isEmail(),
    check('email').custom( emailExist ),
    check('role', 'It\'s not a valid role').isIn(['ADMIN', 'EMPLOYEE', 'CLIENT']),
    
], createUser);

router.put('/:id', [
    validateJWT,
    hasRole('ADMIN'),
    validateFields
], updateUser);

router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN'),
    validateFields
], deleteUser);

export default router;