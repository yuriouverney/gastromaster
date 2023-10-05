const Product = require('../models/product.model');
const BaseCrudService = require('./base-crud.service');

class ProductService extends BaseCrudService {
  constructor() {
    super(Product);
  }

  async getAllProducts() {
    return await this.model.findAll();
  }

  async getProductById(id) {
    return await this.model.findByPk(id);
  }

  async createProduct(form, file) {
    const filePath = file.image ? `${file.image[0].destination}/${file.image[0].filename}` : null;
    form.image = filePath;
    const hasProductSameName = await this.model.findOne({ where: { name: form.name } });
    if (hasProductSameName) throw new Error('Já existe um produto com esse nome');
    return await this.model.create(form);
  }

  async updateProduct(id, form, file) {
    if (file.image) {
      const filePath = file.image ? `${file.image[0].destination}/${file.image[0].filename}` : null;
      form.image = filePath;
    }
    return await this.model.update(form, { where: { id } });
  }
}
module.exports = new ProductService();
