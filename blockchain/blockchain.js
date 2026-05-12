const crypto = require("crypto");

class Block {
  constructor(index, data, previousHash = "") {
    this.index        = index;
    this.timestamp    = new Date().toISOString();
    this.data         = data;
    this.previousHash = previousHash;
    this.hash         = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.data)
      )
      .digest("hex");
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, { message: "Genesis Block" }, "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const previousBlock = this.getLastBlock();
    const newBlock      = new Block(
      this.chain.length,
      data,
      previousBlock.hash
    );
    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock  = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getChain() {
    return this.chain;
  }
}

const certChain = new Blockchain();

const generateVerificationId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "VER-";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const generateBlockchainTxId = () => {
  return "0x" + crypto.randomBytes(32).toString("hex");
};

const addCertificateToChain = (certificateData) => {
  const block = certChain.addBlock(certificateData);
  return block;
};

const getBlockchain = () => {
  return certChain.getChain();
};

const validateBlockchain = () => {
  return certChain.isChainValid();
};

const getBlockchainJSON = () => {
  return JSON.stringify(certChain.getChain(), null, 2);
};

module.exports = {
  addCertificateToChain,
  getBlockchain,
  validateBlockchain,
  generateVerificationId,
  generateBlockchainTxId,
  getBlockchainJSON,
};