const { DataTypes, Model } = require('sequelize');

class Setting extends Model {
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
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        phone: {
          type: DataTypes.STRING,
        },
        address: {
          type: DataTypes.STRING,
        },
        description: {
          type: DataTypes.STRING,
        },
        short_description: {
          type: DataTypes.STRING,
        },
        logo: {
          type: DataTypes.STRING,
        },
        banner: {
          type: DataTypes.STRING,
        },
        about_image: {
          type: DataTypes.STRING,
        },
        opening_hour: {
          type: DataTypes.JSON,
        },
      },
      {
        sequelize,
        modelName: 'Setting',
        freezeTableName: true,
        timestamps: true,
        name: {
          singular: 'Setting',
          plural: 'Settings',
        },
      }
    );
  }
}
module.exports = Setting;
