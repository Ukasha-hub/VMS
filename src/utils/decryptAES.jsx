import CryptoJS from "crypto-js";

export function decryptAES(encryptedBase64Url, key, iv) {
  try {
    // Convert URL-safe Base64 to standard Base64
    const base64 = encryptedBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");

    // Parse Base64 to WordArray
    const encryptedWA = CryptoJS.enc.Base64.parse(paddedBase64);

    // Decrypt with AES-CBC and PKCS7 padding
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedWA },
      CryptoJS.enc.Utf8.parse(key),
      { iv: CryptoJS.enc.Utf8.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    // Convert to string
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("decrypted (URL-encoded)", decryptedStr);

    if (!decryptedStr) return null;

    // Decode URL-encoded string first
    const decodedStr = decodeURIComponent(decryptedStr.replace(/\+/g, ' '));
    console.log("decoded JSON string", decodedStr);

    // Parse JSON
    const parsed = JSON.parse(decodedStr);
    console.log("parsed JSON object", parsed);

    return parsed;
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
}
