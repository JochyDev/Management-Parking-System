import { success, error } from "../helpers/handleResponse.js"

export const hasRole = (...roles) => {

    return (req, res, next) => {

        if( !req.user){
            return error(res, 'Se queire verificar el role sin validar el token primer', 500);
        }
    

        if(!roles.includes(req.user.role)){
            return error(res, `EL usuario servicio require uno de estos roles ${roles}`, 401);
        }
        
        next();
    }

}