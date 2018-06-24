import jsrsasign from 'jsrsasign'

export const sign = (data, key)=>{
    var sHeader = JSON.stringify({
        alg: 'HS256',
        typ: 'JWT'
    });
    var sPayload = JSON.stringify({
        nbf: jsrsasign.KJUR.jws.IntDate.get('now'),
        iat: jsrsasign.KJUR.jws.IntDate.get('now'),
        exp: jsrsasign.KJUR.jws.IntDate.get('now + 1day'),
        data
    });
    return jsrsasign.KJUR.jws.JWS.sign("HS256", sHeader, sPayload, key);
}

export const verify = (token, key)=>{
    const isValid = jsrsasign.KJUR.jws.JWS.verifyJWT(token, key, {
        alg: ["HS256"]
    });
    if (!isValid) throw new Error("Invalid JWT");
    const payloadObj = jsrsasign.KJUR.jws.JWS.readSafeJSONString(Buffer.from(token.split(".")[1], 'base64').toString('utf8'));
    return payloadObj.data;
}