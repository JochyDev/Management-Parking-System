import { Router } from 'express';
import { createMultipleSpots } from '../controllers/index.js';
import { validateJWT, validateFields, hasRole } from '../middlewares/index.js'
const router = Router();

router.post('/:numSpots', [
    validateJWT,
    hasRole('admin'),
    validateFields
], createMultipleSpots);

export default router;