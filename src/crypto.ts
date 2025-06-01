import CryptoJS from "crypto-js";

const secret = process.env.REACT_APP_ENCRYPTION_SECRET!;

// Encrypt a string
export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, secret).toString();
}

// Decrypt a string
export function decrypt(ciphertext: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
}
