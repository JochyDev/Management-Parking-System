import { success, error } from '../helpers/handleResponse.js';
import { logService } from '../services/index.js';


export const getActivityLogs = async (req, res) => {

    const { limit = 25, offset = 0 } = req.query;

    try {
        const [total, logs] = await logService.getActivityLogs(limit, offset); 
        success(res, { total, logs }, 200);
    } catch (err) {
        error(res, err, 500);
    }


}