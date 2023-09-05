
export const UserModel = (sequelize, {Model, DataTypes}) => {
    class User extends Model {}

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
