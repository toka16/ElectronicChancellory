/*eslint no-undef:*/
var window = {};
importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/8.0.12/jsrsasign-all-min.js');

self.onmessage = function (e) {
    console.log('in worker:', e);
    if (e.data && e.data.function && worker[e.data.function]) {
        try {
            var res = worker[e.data.function].apply(this, e.data.args || []);
            self.postMessage({
                key: e.data.key,
                result: res
            })
        } catch (err) {
            self.postMessage({
                key: e.data.key,
                error: err.message
            })
        }
    }

}

var worker = {
    generateKeyPair: function(algorithm, length) {
        const pair = KEYUTIL.generateKeypair(algorithm, length);
        return {
            prvKey: KEYUTIL.getPEM(pair.prvKeyObj, "PKCS1PRV"),
            pubKey: KEYUTIL.getPEM(pair.pubKeyObj)
        };
    },
    signData: function(algorithm, prvKey, data){
        var sig = new KJUR.crypto.Signature({
            alg: algorithm
        });
        sig.init(prvKey);
        sig.updateString(data.toString());
        return sig.sign();
    },

    verifyData: function(algorithm, pubKey, data, signature){
        var sig = new KJUR.crypto.Signature({
            alg: algorithm
        });
        sig.init(pubKey);
        sig.updateString(data.toString());
        return sig.verify(signature);
    },

    successFunc: function(a, b){
        return {a: a, b: b};
    },
    errFunc: function(){
        throw new Error("this is error in worker");
    }
}