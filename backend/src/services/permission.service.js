const Permission = require('../models/permission.model');
const BaseCrudService = require('./base-crud.service');

class PermissionService extends BaseCrudService {
  constructor() {
    super(Permission);
  }

  async gerPermissions() {
    return await this.model.findAll();
  }
}
module.exports = new PermissionService();
