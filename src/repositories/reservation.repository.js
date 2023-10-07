import { db } from '../models/sequelize/index.js';
const { Reservation } = db;


export const getReservationById = async (id) => {
    return await Reservation.findByPk(id);
}

export const findAllReservations = async( data ) => {
    return await Reservation.findAll(data);
}

export const updateReservation = async (id, data) => {
    return await Reservation.update({status: data}, {
        where: { id }
    })
}

export const findOneReservation = async (data) => {
    return await Reservation.findOne({
        where: data,
      });
}
 
export const createReservation = async (data) => {
    return await Reservation.create(data);
}