export const createModel = (sequelize, {Model, DataTypes}) => {
    class Reservation extends Model {
        static associate(models) {
            // define association here
            // one-to-many: Spot-Reservation 
            this.belongsTo(models.Spot);
            // one-to-many: User-Reservation 
            this.belongsTo(models.User);
          }
    }

    Reservation.init({
        startDateTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDateTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'CANCELED'), 
          defaultValue: 'ACTIVE'
        },
      }, {
        sequelize,
        modelName: 'Reservation',
        timestamps: false
    });

    return Reservation;
};
