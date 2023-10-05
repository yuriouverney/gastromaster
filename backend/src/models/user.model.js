const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        googleId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'User',
        freezeTableName: true,
        timestamps: true,
        name: {
          singular: 'User',
          plural: 'Users',
        },
        hooks: {
          beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
          },
        },
      }
    );
  }

  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  static associate(models) {
    this.belongsTo(models.UserProfile, {
      foreignKey: 'user_profile_id',
    });
    this.belongsTo(models.Permission, {
      foreignKey: 'permission_id',
    });
    this.hasMany(models.Order, {
      foreignKey: 'user_id',
    });
    this.hasMany(models.Reservation, {
      foreignKey: 'user_id',
    });
  }
}

module.exports = User;
