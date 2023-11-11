// isValidSignature.js

import crypto from "crypto";

export function isValidSignature(body, signature, channelSecret) {
  const hash = crypto
    .createHmac("sha256", channelSecret)
    .update(body)
    .digest("base64");
  return hash === signature;
}
