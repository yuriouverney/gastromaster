const Setting = require('../models/setting.model');
const BaseCrudService = require('./base-crud.service');
const fs = require('fs');

class SettingService extends BaseCrudService {
  constructor() {
    super(Setting);
  }

  async getSettings() {
    return this.model.findOne();
  }

  async updateSetting(form, files) {
    const setting = await this.model.findOne();
    if (files) {
      if (files.imagelogo) {
        const filePath = files.imagelogo[0]
          ? `${files.imagelogo[0].destination}/${files.imagelogo[0].filename}`
          : null;

        form.logo = filePath;
      }
      if (files.imagebanner) {
        const filePath = files.imagebanner[0]
          ? `${files.imagebanner[0].destination}/${files.imagebanner[0].filename}`
          : null;

        form.banner = filePath;
      }
      if (files.imageabout) {
        const filePath = files.imageabout[0]
          ? `${files.imageabout[0].destination}/${files.imageabout[0].filename}`
          : null;

        form.about_image = filePath;
      }
    }
    return this.model.update(form, { where: { id: setting.id } });
  }

  async getSettingImages() {
    const setting = await this.model.findOne();
    const imageUrls = [
      { image: 'banner', url: setting.banner, buffer: '' },
      { image: 'logo', url: setting.logo, buffer: '' },
      { image: 'aboutImage', url: setting.about_image, buffer: '' },
    ];
    for (const image of imageUrls) {
      if (image.url) {
        const data = fs.readFileSync(image.url);
        image.buffer = data;
      }
    }
    return imageUrls;
  }
}
module.exports = new SettingService();
