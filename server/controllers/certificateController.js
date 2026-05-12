const Certificate = require("../models/Certificate");
const {
  addCertificateToChain,
  generateVerificationId,
  generateBlockchainTxId,
  getBlockchain,
  validateBlockchain,
  getBlockchainJSON,
} = require("../blockchain/blockchain");
const {
  pushFileToGithub,
  getFileFromGithub,
} = require("../config/github");

// UPLOAD CERTIFICATE
const uploadCertificate = async (req, res) => {
  try {
    const { studentName, course } = req.body;

    const verificationId = generateVerificationId();
    const blockchainTxId = generateBlockchainTxId();

    const block = addCertificateToChain({
      studentName,
      course,
      verificationId,
      timestamp: new Date().toISOString(),
    });

    const certificate = await Certificate.create({
      studentName,
      course,
      verificationId,
      blockchainHash: block.hash,
      previousHash:   block.previousHash,
      blockIndex:     block.index,
      fileUrl:        req.file ? req.file.path : "",
      status:         "Verified",
      uploadedBy:     req.user._id,
    });

    // push certificate to github
    const certData = JSON.stringify({
      studentName,
      course,
      verificationId,
      blockchainHash: block.hash,
      previousHash:   block.previousHash,
      blockIndex:     block.index,
      status:         "Verified",
      issueDate:      new Date().toISOString(),
    }, null, 2);

    await pushFileToGithub(
      `certificates/${verificationId}.json`,
      certData,
      `Add certificate: ${studentName} - ${course}`
    );

    // push blockchain ledger to github
    const ledgerData = getBlockchainJSON();
    await pushFileToGithub(
      "blockchain/ledger.json",
      ledgerData,
      `Update blockchain ledger - Block #${block.index}`
    );

    res.status(201).json({
      message:       "Certificate uploaded successfully",
      certificate,
      blockchainTxId,
      block: {
        index:        block.index,
        hash:         block.hash,
        previousHash: block.previousHash,
        timestamp:    block.timestamp,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL CERTIFICATES
const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({})
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE CERTIFICATE
const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate(
      "uploadedBy", "name email"
    );
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY CERTIFICATE
const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      verificationId: req.params.verificationId,
    });

    if (!certificate) {
      // try to get from github
      const githubData = await getFileFromGithub(
        `certificates/${req.params.verificationId}.json`
      );

      if (githubData) {
        const certData = JSON.parse(githubData);
        return res.json({
          verified:    true,
          message:     "Certificate verified from GitHub",
          certificate: certData,
          source:      "github",
        });
      }

      return res.status(404).json({
        verified: false,
        message:  "Certificate not found",
      });
    }

    res.json({
      verified:    true,
      message:     "Certificate is valid",
      certificate,
      source:      "database",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CERTIFICATE
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    await certificate.deleteOne();
    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BLOCKCHAIN LEDGER
const getBlockchainLedger = async (req, res) => {
  try {
    const chain        = getBlockchain();
    const isValid      = validateBlockchain();
    const certificates = await Certificate.find({}).sort({ blockIndex: 1 });

    const ledger = chain.map((block) => {
      if (block.index === 0) {
        return {
          index:        block.index,
          hash:         block.hash,
          previousHash: block.previousHash,
          timestamp:    block.timestamp,
          data:         { message: "Genesis Block" },
          isGenesis:    true,
        };
      }

      const cert = certificates.find((c) => c.blockIndex === block.index);

      return {
        index:        block.index,
        hash:         block.hash,
        previousHash: block.previousHash,
        timestamp:    block.timestamp,
        data: {
          studentName:    cert ? cert.studentName    : block.data.studentName,
          course:         cert ? cert.course         : block.data.course,
          verificationId: cert ? cert.verificationId : block.data.verificationId,
          status:         cert ? cert.status         : "Verified",
        },
        isGenesis: false,
      };
    });

    res.json({
      ledger,
      isValid,
      totalBlocks: chain.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadCertificate,
  getCertificates,
  getCertificateById,
  verifyCertificate,
  deleteCertificate,
  getBlockchainLedger,
};