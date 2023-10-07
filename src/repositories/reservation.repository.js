import { Op } from 'sequelize';
import { db } from '../models/sequelize/index.js';
const { Reservation } = db;


export const getReservationById = async (id) => {
    return await Reservation.findByPk(id);
}

export const findAllCurrentReservations = async() => {
    return await Reservation.findAll({
        where: {
          status: 'ACTIVE',
          [Op.and]: [
            {
              startDateTime: {
                [Op.lt]: new Date(),
              },
              endDateTime: {
                [Op.gt]: new Date(),
              },
            },
          ],
        },
      });
}

export const updateReservation = async (id, data) => {
    return await Reservation.update({status: data}, {
        where: { id }
    })
}

export const findOneOverlappingReservation = async (SpotId, startDateTime, endDateTime) => {    
    return await Reservation.findOne({
        where: {
          SpotId: SpotId,
          [Op.or]: [
            {
              startDateTime: {
                [Op.lt]: endDateTime,
              },
              endDateTime: {
                [Op.gt]: startDateTime,
              },
            },
          ],
        },
      });
}
 
export const createReservation = async (data) => {
    return await Reservation.create(data);
}