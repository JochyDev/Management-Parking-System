import { db } from '../models/sequelize/index.js'
const { User } = db;

export const emailExist = async(email = '') => {

    // Verificar si el correo exite
    const existMail = await User.findOne({
        where: { email }
    });

    if(existMail){
       throw new Error(`The email: ${email} is already registered`);
    }
}

export const userDoesntExist = async(id = '') => {
    
    const user = await User.findByPk(id);

    if(!user){
        throw new Error(`User with id=${id} dosen\'t exist!`);
    }

}