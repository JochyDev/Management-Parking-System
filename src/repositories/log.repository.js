import { Log } from '../models/mongoose/log.model.js';

export const getAllLogsAndCount = async(limit, offset) => {
    return await Promise.all([
        Log.countDocuments(),
        Log.find()
                .limit(limit)
                .skip(offset)
    ])
}