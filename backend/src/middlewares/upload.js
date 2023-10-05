const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'files/images',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'imagelogo', maxCount: 1 },
  { name: 'imagebanner', maxCount: 1 },
  { name: 'imageabout', maxCount: 1 },
]);

module.exports = upload;
