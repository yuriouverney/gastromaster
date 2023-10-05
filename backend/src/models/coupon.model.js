const { DataTypes, Model } = require('sequelize');

class Coupon extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        value: {
          type: DataTypes.DECIMAL(7, 2),
          allowNull: false,
        },
        order_min_value: {
          type: DataTypes.DECIMAL(7, 2),
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
        },
        active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        expiration_date: {
          type: DataTypes.DATEONLY,
        },
      },
      {
        sequelize,
        modelName: 'Coupon',
        freezeTableName: true,
        timestamps: true,
        name: {
          singular: 'Coupon',
          plural: 'Coupons',
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Order, {
      foreignKey: 'coupon_id',
    });
  }
}
module.exports = Coupon;
