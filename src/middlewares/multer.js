import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { fileType } = req.body;
    let destination = '../uploads/documents';

    if (fileType === 'profile') {
      destination = '../uploads/profiles';
    } else if (fileType === 'product') {
      destination = '../uploads/products';
    }

    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});

const upload = multer({ storage: storage });

export default upload;
