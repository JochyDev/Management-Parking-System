


export const getReservationById = async (id) => {
    return await Reservation.findByPk(id);
}