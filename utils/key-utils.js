import {
  call
} from './worker-helper'

export const generatePair = ({
  alg = "RSA",
  len = 2048
} = {}) => {
  return call('generateKeyPair', [alg, len])
};