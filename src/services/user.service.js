import  bcryptjs  from "bcryptjs";

import { db } from '../models/sequelize/index.js';
const { User } = db;

export const getUsers = async(limit, offset) => {
    return await User.findAndCountAll(
        { 
            offset: parseInt(offset),
            limit:  parseInt(limit)
        }
    );
}

export const getUserById = async( id ) => {
    const user = await User.findByPk(id);

    if(!user){
        throw new Error(`User with id=${id} was not found. `)
    }

    return user;
}

export const getUserByEmail = async( email ) => {
    const user = await User.findOne({
        where: { email }
    });

    if(!user){
        throw new Error(`User with email=${email} was not found.`)
    }

} 

export const createUser = async( body ) => {

    const { name, email, phone, password } = body;

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);

    const entity = {
        name,
        email,
        phone,
        password: hash
    }

    return await User.create(entity);
}

export const updateUser = async( id, data ) => {

    await User.update(data, {
        where: { id }
    });

    return await getUserById(id);
    
}

export const deleteUser = async( id ) => {

    return await User.destroy({where: { id }});
    
}