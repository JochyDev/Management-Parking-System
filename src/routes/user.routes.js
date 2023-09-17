import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/index.js';
import { validateJWT, validateFields, hasRole } from '../middlewares/index.js'

const router = Router();

router.get('/', [
    validateJWT,
    hasRole('ADMIN', 'EMPLOYEE'),
    validateFields
], getUsers);

router.post('/', createUser);

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