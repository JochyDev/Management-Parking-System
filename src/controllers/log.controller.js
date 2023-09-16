import { success, error } from '../helpers/handleResponse.js';
import { Log } from '../mongooseModels/log.model.js';

export const checkLogsActivity = async (req, res) => {

    try {
        const logs = await Log.find()
        success(res, logs, 200);
    } catch (err) {
        error(res, err, 500);
    }


}