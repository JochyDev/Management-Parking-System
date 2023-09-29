import generateJWT from "../helpers/generateJWT.js";
import { userRepository } from "../repositories/index.js";


export const login = async (email, password ) => {

        const user = await userRepository.getUserByEmail(email);

        if(!user){
            throw new Error(`User with email=${email} was not found.`)
        }

        const validPassword = bcryptjs.compareSync(password, user.password);

        // Verificar la contraseña
        if(!validPassword){
            throw new Error("Password incorrect", 406)
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        return {user, token};
}  