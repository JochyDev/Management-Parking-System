
import { success, error } from "../helpers/handleResponse.js";
import { authService } from "../services/index.js";


export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const data = authService.login(email, password);
        success(res, data, 200);
        
    } catch (err) {
        error(res, err, 500);
    }
}