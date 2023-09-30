
import { error, success } from "../helpers/handleResponse.js";
import { userService }  from '../services/index.js';


export const getUsers = async (req, res) => {
    
    const { limit = 5, offset = 0 } = req.query;

    try {
        const users = await userService.getUsers(limit, offset);
        success(res, users, 200);
    } catch (err) {
        error(res, err, 500);
    }
};

export const createUser = async(req, res) => {
    
    const { body } = req;

    try {
        const data = await userService.createUser(body);
        success(res, data, 200);
    } catch (err) {
        error(res, err.message, 500)
    }

}

export const updateUser = async ( req, res ) => {

    const { id } = req.params;
    
    const { id: _id, password, ...data } = req.body;

    try {
        const updatedUser = await userService.updateUser(id, data);
        success(res, updatedUser, 200);
    
    } catch (err) {
        error( res, `Error updating User with id=${id}`, 500 );   
    }

}

export const deleteUser = async ( req, res ) => {
    
    const { id } = req.params;

    try {
        const num = await userService.deleteUser(id);
        if( num == 1){
            success(res, "User was deleted successfully.", 200);
        } else {
            error(res, `Cannot delete User with id=${id}. Maybe User was not found`, 404 );
        }
    } catch (err) {
        error( res, `Error updating User with id=${id}`, 500 );   
    }
}
