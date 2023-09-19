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