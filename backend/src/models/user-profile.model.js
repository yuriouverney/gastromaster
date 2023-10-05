const { DataTypes, Model } = require('sequelize');
class UserProfile extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        address: {
          type: DataTypes.STRING,
        },
        phone: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: 'UserProfile',
        freezeTableName: true,
        timestamps: true,
        name: {
          singular: 'UserProfile',
          plural: 'UserProfiles',
        },
      }
    );
  }

  static associate(models) {
    this.hasOne(models.User, {
      foreignKey: 'user_profile_id',
    });
  }
}
module.exports = UserProfile;
