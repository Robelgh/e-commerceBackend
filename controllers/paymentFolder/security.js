

define ('HMAC_SHA256', 'sha256');
define ('SECRET_KEY', '393f23de003e44708c5c13d700e1f55a2fd56f72afd944ec8bb4d42a54c3ee12730b89f02b98470985f226aa87ed21274605f44624a0479da334bd65444e2530053ea736b1044d6089f99df52c323afc2472f1dcde384d4ea7f096fa2b7fae006829399b32e14e4ab4ba14f13bfd55bf1c425f314ad344b490804f4efd446cc2');

function sign (params) {
  return signData(buildDataToSign(params), SECRET_KEY);
}

function signData(data, $secretKey) {
    return base64_encode(hash_hmac('sha256', data, $secretKey, true));
}

function buildDataToSign(params) {
        var signedFieldNames = explode(",",params["signed_field_names"]);
        // foreach (signedFieldNames as field) {
          var dataToSign=[];
          signedFieldNames.forEach((element) => {
            dataToSign.push(element + "=" + params[element]);
          })
            // var dataToSign[] = field + "=" + params[field];
        // }
        return commaSeparate(dataToSign);
}

function commaSeparate (dataToSign) {
    return implode(",",dataToSign);
}


