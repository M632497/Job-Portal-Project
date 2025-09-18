import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosinstance";

// Get signature from backend
const getSignature = async (folder) => {
  const res = await axiosInstance.get(
    `${API_PATHS.IMAGE.GET_SIGNATURE}?folder=${folder}`
  );
  return res.data;
};

//  Upload resume (PDF/DOC) to Cloudinary (signed)
const uploadResume = async (file, folder = "resumes") => {
  if (!file) return null;

  const { signature, timestamp, cloudName, apiKey } = await getSignature(folder);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  // use "raw/upload" for non-images
  const cloudinaryRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await cloudinaryRes.json();

  if (data.secure_url) {
    return data.secure_url; 
  } else {
    throw new Error("Resume upload failed: " + JSON.stringify(data));
  }
};

export default uploadResume;
