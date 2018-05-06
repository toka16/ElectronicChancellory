import r from "jsrsasign";

export const generatePair = ({ alg = "RSA", len = 1024 } = {}) => {
  const pair = r.KEYUTIL.generateKeypair(alg, len);
  return {
    prvKey: r.KEYUTIL.getPEM(pair.prvKeyObj, "PKCS1PRV"),
    pubKey: r.KEYUTIL.getPEM(pair.pubKeyObj)
  };
};