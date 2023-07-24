import multer from "multer";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${new Date().valueOf()}_${file.originalname}`);
  },
});

export const upload = multer({ storage: storage });
