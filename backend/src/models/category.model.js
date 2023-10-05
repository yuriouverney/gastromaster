const { DataTypes, Model } = require('sequelize');
class Category extends Model {
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
      },
      {
        sequelize,
        modelName: 'Category',
        freezeTableName: true,
        timestamps: true,
        name: {
          singular: 'Category',
          plural: 'Categories',
        },
      }
    );
  }

  static associate(models) {
    this.hasOne(models.Product, {
      foreignKey: 'category_id',
    });
  }
}
module.exports = Category;
