import r from "jsrsasign";

const signatureAlgorithm = "SHA1withRSA";

export class Signer {
  constructor(prvKey) {
    this.prvKey = prvKey;
  }

  createSigner() {
    var sig = new r.KJUR.crypto.Signature({ alg: signatureAlgorithm });
    sig.init(this.prvKey);
    return sig;
  }

  signText(text) {
    const sig = this.createSigner();
    sig.updateString(text);
    return sig.sign();
  }
}

export class Validator {
  constructor(pubKey) {
    this.pubKey = pubKey;
  }

  createValidator() {
    var sig = new r.KJUR.crypto.Signature({ alg: signatureAlgorithm });
    sig.init(this.pubKey);
    return sig;
  }

  validateText(text, signature) {
    const sig = this.createValidator();
    sig.updateString(text);
    return sig.verify(signature);
  }
}
