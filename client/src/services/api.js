import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// AUTH
export const registerUser       = (data) => API.post("/auth/register", data);
export const loginUser          = (data) => API.post("/auth/login",    data);
export const logoutUser         = ()     => API.post("/auth/logout");

// CERTIFICATES
export const uploadCertificate  = (data) => API.post("/certificates/upload", data);
export const getCertificates    = ()     => API.get("/certificates");
export const getCertificateById = (id)   => API.get(`/certificates/${id}`);
export const deleteCertificate  = (id)   => API.delete(`/certificates/${id}`);

// VERIFY
export const verifyCertificate  = (verificationId) =>
  API.get(`/certificates/verify/${verificationId}`);

// BLOCKCHAIN LEDGER
export const getBlockchainLedger = () => API.get("/certificates/blockchain");