
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
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        spotNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Spot',
        timestamps: false
    });

    return Spot;
};