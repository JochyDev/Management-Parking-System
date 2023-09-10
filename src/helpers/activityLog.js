import { Log } from '../mongooseModels/log.model.js';
import { db } from '../models/index.js';
const { User } = db;

export const activityLog = async (userId, action) => {

    try {
        const log = await Log.create({userId, action});

        const user = await User.findOne({where: { id: userId}});

        console.log(`Action: ${log.action} by user ${user.role}: ${user.name }`);
    } catch (err) {
        console.log(err);
    }

}