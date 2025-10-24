// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Thay thế bằng cấu hình của bạn mà BE đã gửi
const firebaseConfig = {
  apiKey: "AIzaSyAHHczqc89YPWZzixLSguDXtHbrFGEDzJQ ",
  authDomain: "dollstoreauth-a038b.firebaseapp.com",
  projectId: "dollstoreauth-a038b",
  storageBucket: "dollstoreauth-a038b.appspot.com",
  messagingSenderId: "117505181305",
  appId: "1:117505181305:web:84e59fde99c18db72b36a8"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo dịch vụ Firebase Authentication và export nó
export const auth = getAuth(app);