const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

const getUploadedFiles = () =>
  fs
    .readdirSync(uploadsDir)
    .map((fileName) => {
      const filePath = path.join(uploadsDir, fileName);
      const stats = fs.statSync(filePath);

      return {
        fileName,
        sizeInKb: (stats.size / 1024).toFixed(2),
      };
    })
    .sort((a, b) => b.fileName.localeCompare(a.fileName));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/uploads", express.static(uploadsDir));

app.get("/", (_req, res) => {
  res.render("home", {
    files: getUploadedFiles(),
    message: null,
    error: null,
  });
});

app.post("/upload", upload.single("myFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).render("home", {
      files: getUploadedFiles(),
      message: null,
      error: "Please choose a file before uploading.",
    });
  }

  return res.render("home", {
    files: getUploadedFiles(),
    message: `Uploaded: ${req.file.originalname}`,
    error: null,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
