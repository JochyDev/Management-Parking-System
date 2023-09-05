import { connect } from 'mongoose';

export const mongodbConection = async() => {
    try {
        await connect(process.env.MONGODB_CNN || 'mongodb://127.0.0.1:27017/parkingLogsDB');
        console.log('parkingLogsDB is online')
        
    } catch (error) {
        console.log(error);
        throw Error('Error al conectarse a la base de datos');
    }
}

