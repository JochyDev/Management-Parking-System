
import  bcryptjs  from "bcryptjs";
import { success, error } from "../helpers/handleResponse.js";
import { db } from '../models/index.js';
const { users: User} = db;

export const getUsers = async (req, res) => {
    
    const { limit = 5, offset = 0 } = req.query;

    try {
        const data = await User.findAndCountAll(
            { 
                where: { active: true },
                offset: parseInt(offset),
                limit:  parseInt(limit)
            }
        );

        success(res, data, 200);

    } catch (err) {
        error(res, err, 500);
    }
};

export const createUser = async(req, res) => {
    
    const { name, email, password, phone } = req.body;

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);

    const userData = {
        name,
        email,
        phone,
        password: hash
    }

    try {
        const data = await User.create(userData);
        success(res, data, 200)
    } catch (error) {
        error(res, err, 500)
    }

}

