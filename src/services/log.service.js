import { Log } from '../models/mongoose/log.model.js';

export const getActivityLogs = async ( limit, offset ) => {
    
    return await Promise.all([
        Log.countDocuments(),
        Log.find()
                .limit(limit)
                .skip(offset)
    ])
}