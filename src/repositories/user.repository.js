import { db } from '../models/sequelize/index.js';
const { User } = db;

export const getAllUsersAndCount = async(limit, offset) => {
    return await User.findAndCountAll(
        { 
            offset: parseInt(offset),
            limit:  parseInt(limit)
        }
    );
} 

export const getUserById = async(id) => {
    return await User.findByPk(id);
}

export const getUserByEmail = async( email ) => {
    return User.findOne({
        where: { email }
    });
}

export const createUser = async(entity) => {
    return await User.create(entity);
}

export const updateUser = async(id, data) => {
    return await User.update(data, {
        where: { id }
    });
}

export const deleteUser = async(id) => {
    return await User.destroy({where: { id }});
}