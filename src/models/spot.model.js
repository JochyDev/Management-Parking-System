
export const createModel = (sequelize, {Model, DataTypes}) => {
    class Spot extends Model {
        static associate(models) {
            // define association here
            // one-to-many: Spot-Reservation 
            this.hasMany(models.Reservation);
        }
    }

    Spot.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }
    }, {
        sequelize,
        modelName: 'Spot',
        timestamps: false
    });

    return Spot;
};