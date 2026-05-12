const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");
const {
  uploadCertificate,
  getCertificates,
  getCertificateById,
  verifyCertificate,
  deleteCertificate,
  getBlockchainLedger,
} = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.get(   "/verify/:verificationId",                         verifyCertificate);
router.get(   "/blockchain",             protect,                getBlockchainLedger);
router.post(  "/upload",                 protect, upload.single("file"), uploadCertificate);
router.get(   "/",                       protect,                getCertificates);
router.get(   "/:id",                    protect,                getCertificateById);
router.delete("/:id",                    protect,                deleteCertificate);

module.exports = router;