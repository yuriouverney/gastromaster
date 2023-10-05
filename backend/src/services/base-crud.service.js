/* eslint-disable */
class BaseCrudService {
    constructor(model) {
      this.model = model;
    }
  
    async create(data) {
      try {
      return await this.model.create(data)
      } catch (error) {
        throw error;
      }
    }
  
    async getAll(filter = {}) {
      try {
        return await this.model.findAll(filter);
      } catch (error) {
        throw error;
      }
    }
  
    async getById(id) {
      try {
        return await this.model.findByPk(id);
      } catch (error) {
        throw error;
      }
    }
  
    async update(id, data) {
      try {
        await this.model.update(data, { where: { id } });
        return await this.model.findByPk(id);
      } catch (error) {
        throw error;
      }
    }
  
    async delete(id) {
      try {
        const record = await this.model.findByPk(id);
        if (!record) {
          throw new Error('Record not found');
        }
        await record.destroy();
        return record;
      } catch (error) {
        throw error;
      }
    }
  }
  
  module.exports = BaseCrudService;
  
  