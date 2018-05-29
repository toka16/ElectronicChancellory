import r from "jsrsasign";

let w, calls = {};
if (process.browser) {
  w = new Worker("/worker.js");

  w.onmessage = (e)=>{
    console.log('onmessage',e);
    if (e.data && e.data.key && calls[e.data.key]){
      calls[e.data.key](e.data);
    }
  }
}

export const generatePair = ({ alg = "RSA", len = 2048 } = {}) => {
  // eslint-disable-next-line
  return new Promise((resolve, reject)=>{
    const key = randomKey();
    calls[key] = (data) => {
      if (data.error){
        reject(data.error);
      }else{
        resolve(data.result);
      }
    }
    w.postMessage({function: 'generateKeyPair', args: [alg, len], key})
  });
};


function randomKey(){
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}