import { Log } from '../models/mongoose/log.model.js';
import { db } from '../models/sequelize/index.js';
const { User } = db;

export const logActivity = async (userId, action) => {

    try {
        const log = await Log.create({userId, action});

        const user = await User.findOne({where: { id: userId}});

        console.log(`Action: ${log.action} by user ${user.role}: ${user.name }`);
    } catch (err) {
        console.log(err);
    }

}