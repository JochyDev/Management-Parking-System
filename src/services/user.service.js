import  bcryptjs  from "bcryptjs";
import { userRepository } from "../repositories/index.js";

export const getUsers = async(limit, offset) => {
    return userRepository.getAllUsersAndCount(limit, offset);
}

export const getUserById = async( id ) => {
    const user = await userRepository.getUserById(id)

    if(!user){
        throw new Error(`User with id=${id} was not found. `)
    }

    return user;
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

    return await userRepository.createUser(entity);
}

export const updateUser = async( id, data ) => {

    await userRepository.updateUser(id, data)

    return await userRepository.getUserById(id);
    
}

export const deleteUser = async( id ) => {

    return await userRepository.deleteUser(id);
    
}