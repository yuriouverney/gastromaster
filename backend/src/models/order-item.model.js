const { DataTypes, Model } = require('sequelize');
class OrderItem extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        price: {
          type: DataTypes.DECIMAL(7, 2),
        },
      },
      {
        sequelize,
        modelName: 'OrderItem',
        freezeTableName: true,
        timestamps: true,
        name: {
          singular: 'OrderItem',
          plural: 'OrderItems',
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'order_id',
    });
    this.belongsTo(models.Product, {
      as: 'product',
      foreignKey: 'product_id',
    });
  }
}

module.exports = OrderItem;
