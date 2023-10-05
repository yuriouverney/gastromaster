const { DataTypes, Model } = require('sequelize');
const ReservationStatus = require('./enums/reservation-status.enum');

class Reservation extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
        },
        amountPeople: {
          type: DataTypes.INTEGER,
        },
        obs: {
          type: DataTypes.STRING,
        },
        user_id: {
          type: DataTypes.INTEGER,
        },
        status: {
          type: DataTypes.ENUM,
          values: Object.values(ReservationStatus),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Reservation',
        freezeTableName: true,
        timestamps: true,
        name: {
          singular: 'Reservation',
          plural: 'Reservations',
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
  }
}
module.exports = Reservation;
