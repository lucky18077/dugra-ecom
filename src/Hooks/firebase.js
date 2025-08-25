import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZwP6XwJsN4c4mhm5gihxlzC3mflGI3To",
  authDomain: "bulkbasketindia-dfda5.firebaseapp.com",
  projectId: "bulkbasketindia-dfda5",
  storageBucket: "bulkbasketindia-dfda5.firebasestorage.app",
  messagingSenderId: "933982304",
  appId: "1:933982304:web:6c93fa75b51b128106d305",
  measurementId: "G-PPSLRTPTV6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Setup recaptcha
export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container", // must match your div id
      {
        size: "invisible", // or "normal"
        callback: (response) => {
          console.log("reCAPTCHA solved:", response);
        },
      }
    );
  }
  return window.recaptchaVerifier;
};

export const sendOtp = async (phoneNumber) => {
  try {
    const appVerifier = setupRecaptcha();
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
