const BaseCrudService = require('./base-crud.service');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Permission = require('../models/permission.model');
const UserProfile = require('../models/user-profile.model');
const sequelize = require('../db/database');
const bcrypt = require('bcrypt');
const PermissionType = require('../models/enums/permission-type.enum');

class UserService extends BaseCrudService {
  constructor() {
    super(User);
  }

  async validateCreateUser(form) {
    if (!form.name || !form.email || !form.password) throw new Error('Falta Dados');
    const checkEmailRepetido = await this.model.findAll({ where: { email: form.email } });
    if (checkEmailRepetido.length > 0) throw new Error('Email já cadastrado');
  }

  async validateLoginUser(form) {
    if (!form.email || !form.password) throw new Error('Falta Dados');
    const usuario = await this.model.findOne({ where: { email: form.email } });
    if (!usuario) throw new Error('Usuário não encontrado.');
    const isPasswordValid = await usuario.verifyPassword(form.password);
    if (!isPasswordValid) {
      throw new Error('Senha incorreta.');
    }
    const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY_JWT, {
      expiresIn: process.env.TIME_JWT,
    });
    return token;
  }

  async createUser(form) {
    await this.validateCreateUser(form);
    const transaction = await sequelize.transaction();
    try {
      const userProfile = await UserProfile.create({ transaction });
      form.user_profile_id = userProfile.id;
      const permission = await Permission.findOne({
        where: { type: PermissionType.USER },
        transaction,
      });
      form.permission_id = permission.id;
      await this.create(form, { transaction });
      await transaction.commit();
      return;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async login(form) {
    const token = await this.validateLoginUser(form);
    const user = await this.model.findOne({
      where: { email: form.email },
      attributes: { exclude: ['password'] },
      include: [{ model: Permission }],
    });
    const session = { token, user };
    return session;
  }

  async getAllUsers() {
    return this.model.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async getUserSession(id) {
    const user = await this.model.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Permission, attributes: ['type'] }],
    });
    const session = user;
    return session;
  }

  async getUserById(id) {
    const user = await this.model.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Permission, attributes: ['type'] }, { model: UserProfile }],
    });
    return user;
  }

  async deleteUser(id) {
    const user = await this.model.findByPk(id);
    if (!user) throw new Error('Usuário não encontrado');
    return user.destroy();
  }

  async updateUser(id, form) {
    const transaction = await sequelize.transaction();
    try {
      if (form.password) {
        form.password = await bcrypt.hash(form.password, 10);
      }
      const formUserProfile = form.UserProfile;
      delete form.UserProfile;
      const user = await this.model.findByPk(id, { transaction });
      if (!user) throw new Error('Usuário não encontrado');
      await user.update(form, { transaction });
      const userProfile = await UserProfile.findOne({
        where: { id: user.user_profile_id },
        transaction,
      });
      if (!userProfile) throw new Error('Perfil do usuário não encontrado');
      await userProfile.update(formUserProfile, { transaction });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new UserService();
