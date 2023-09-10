import jwt from 'jsonwebtoken';
import { success, error } from '../helpers/handleResponse.js';
import { db } from '../models/index.js';
const { User } = db;

export const validateJWT = async(req, res, next) => {

    const token = req.header('x-token');

    if(!token){
        return error(res, 'There isn\'t token in the request', 401)
    }

    try {
        const { userId } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const user = await User.findByPk(userId);

        if(!user){
            return error(res, 'Token isn\'t valid!!!', 401);
        }

        req.user = user;

        next();
    } catch (err) {
        error(res, 'Token isn\'t valid!!!', 401);
    }

};