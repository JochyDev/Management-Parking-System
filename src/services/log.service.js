import { logRepository } from '../repositories/index.js';

export const getActivityLogs = async ( limit, offset ) => {
    
    return await logRepository.getAllLogsAndCount(limit, offset);
}