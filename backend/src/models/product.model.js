const { DataTypes, Model } = require('sequelize');

class Product extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
        },
        price: {
          type: DataTypes.DECIMAL(7, 2),
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING,
        },
        promotion: {
          type: DataTypes.BOOLEAN,
        },
        promotion_percent: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        modelName: 'Product',
        freezeTableName: true,
        timestamps: true,
        name: {
          singular: 'Product',
          plural: 'Products',
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
    });
    this.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
    });
  }
}
module.exports = Product;
