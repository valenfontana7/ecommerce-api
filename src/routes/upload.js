const server = require("express").Router();
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/imagenes/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" || ext !== ".png") {
      cb(res.status(400).end("only jpg, png are allowed"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single("file");

server.post("/", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.json({ success: false, err: err });
    } else {
      res.json({
        success: true,
        image: res.req.file.path,
        fileName: res.req.file.filename,
      });
    }
  });
});

module.exports = server;
