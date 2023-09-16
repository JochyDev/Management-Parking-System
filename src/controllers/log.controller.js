import { success, error } from '../helpers/handleResponse.js';
import { Log } from '../mongooseModels/log.model.js';

export const getActivityLogs = async (req, res) => {

    const { limit = 25, offset = 0 } = req.query;

    try {
        const [total, logs] = await Promise.all([
            Log.countDocuments(),
            Log.find()
                    .limit(limit)
                    .skip(offset)
        ])
        success(res, { total, logs }, 200);
    } catch (err) {
        error(res, err, 500);
    }


}