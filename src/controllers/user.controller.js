
import  bcryptjs  from "bcryptjs";
import { success, error } from "../helpers/handleResponse.js";
import { db } from '../models/index.js';
const { User} = db;

export const getUsers = async (req, res) => {
    
    const { limit = 5, offset = 0 } = req.query;

    try {
        const data = await User.findAndCountAll(
            { 
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
    } catch (err) {
        error(res, err, 500)
    }

}

export const updateUser = async ( req, res ) => {

    const { id } = req.params;
    
    const { id: _id, password, ...data } = req.body;

    try {
        const num = await User.update(data, {
            where: { id }
        })
        if (num == 1) {
            const updatedUser = await User.findByPk(3)
            success(res, updatedUser, 200);
        } else {
            error(res, `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`, 400);
        }
    } catch (err) {
        error( res, `Error updating Tutorial with id=${id}`, 500 );   
    }

}

export const deleteUser = async ( req, res ) => {
    
    const { id } = req.params;


    try {
        const num = await User.destroy({where: { id }});
        if( num == 1){
            success(res, "User was deleted successfully.", 200);
        } else {
            error(res, `Cannot delete User with id=${id}. Maybe User was not found or req.body is empty!`, 400 );
        }
    } catch (err) {
        error( res, `Error updating Tutorial with id=${id}`, 500 );   
    }
}
