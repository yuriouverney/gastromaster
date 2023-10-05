const { DataTypes, Model } = require('sequelize');
const PermissionType = require('./enums/permission-type.enum');
class Permission extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          type: DataTypes.ENUM,
          values: Object.values(PermissionType),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Permission',
        freezeTableName: true,
        timestamps: true,
        name: {
          singular: 'Permission',
          plural: 'Permissions',
        },
      }
    );
  }

  static associate(models) {
    this.hasOne(models.User, {
      foreignKey: 'permission_id',
    });
  }
}
module.exports = Permission;
