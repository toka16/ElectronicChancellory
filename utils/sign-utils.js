import {
  call
} from './worker-helper'

const signatureAlgorithm = "SHA1withRSA";

export const sign = (key, data)=>{
  return call('signData', [signatureAlgorithm, key, data]);
}

export const validate = (key, data, signature) => {
  return call('verifyData', [signatureAlgorithm, key, data, signature]);
}

export const validateWithMultipleKey = async (keys, data, signature) => {
  for (let key of keys){
    const res = await validate(key.pub_key, data, signature);
    if (res) return res;
  }
}