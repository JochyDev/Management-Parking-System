import bcryptjs from 'bcryptjs'; 

import generateJWT from '../helpers/generateJWT.js';
import { success, error } from "../helpers/handleResponse.js";
import { db } from '../models/index.js';
const { users: User} = db;

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({
            where: { email }
        })

        if(!user ){
            return error(res, "Email doesn't exist!!", 404)
        }

        const validPassword = bcryptjs.compareSync(password, user.password);

        // Verificar la contraseña
        if(!validPassword){
            return error(res, "Password incorrect", 406)
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        success(res, {user, token}, 200);
        
    } catch (err) {
        error(res, err, 500);
    }
}