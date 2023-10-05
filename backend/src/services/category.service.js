const Category = require('../models/category.model');
const BaseCrudService = require('./base-crud.service');

class CategoryService extends BaseCrudService {
  constructor() {
    super(Category);
  }

  async getAllCategories() {
    return await this.model.findAll();
  }

  async getCategoryById(id) {
    return this.model.findByPk(id);
  }

  async createCategory(form) {
    const hasCategorySameName = await this.model.findOne({ where: { name: form.name } });
    if (hasCategorySameName) throw new Error('Já existe uma categoria com esse nome');
    return await this.model.create(form);
  }

  async updateCategory(id, form) {
    return await this.model.update(form, { where: { id } });
  }
}
module.exports = new CategoryService();
