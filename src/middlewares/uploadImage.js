const multer = require("multer");

exports.uploadImage = (imageFile) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|png|PNG)$/)) {
        req.fileValidationError = {
          message: "Only JPG and PNG files are allowed!",
        };
        return cb(new Error("Only JPG and PNG files are allowed!"), false);
      }
    }
    cb(null, true);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 100000,
    },
  }).single(imageFile);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(200).send(req.fileValidationError);
      }

      if (!req.file && !err) {
        return res.status(200).send({
          message: "Please select file to upload",
        });
      }

      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file size 100 KB",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};
