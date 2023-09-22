import generateJWT from "../helpers/generateJWT.js";
import { getUserByEmail } from "./user.service.js";


export const login = async (email, password ) => {

        const user = await getUserByEmail(email);

        const validPassword = bcryptjs.compareSync(password, user.password);

        // Verificar la contraseña
        if(!validPassword){
            throw new Error("Password incorrect", 406)
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        return {user, token};
}  