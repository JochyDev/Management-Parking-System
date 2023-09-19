
export const createModel = (sequelize, {Model, DataTypes}) => {
    class User extends Model {
        static associate(models) {
            // define association here
            // one-to-many: User-Reservation 
            this.hasMany(models.Reservation);
        }
    }

    User.init({
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
          type: DataTypes.STRING(45),
          allowNull: false,
          unique: true
        },
        phone: {
          type: DataTypes.STRING(45),
          allowNull: false,
          unique: true
        },
        password: {
            type:  DataTypes.STRING(64),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'EMPLOYEE', 'CLIENT'),
            defaultValue: 'CLIENT'
        }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: false
    });

    return User;
};

