import { validationResult } from "express-validator";
import { error } from '../helpers/handleResponse.js';


export const validateFields = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return error(res, errors, 400);
    }

    next();

}