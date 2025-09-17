import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosinstance";
const uploadImage = async (imageFile, folder = "uploads") => {
  const { signature, timestamp, cloudName, apiKey } = await getSignature(folder);

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const cloudinaryRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await cloudinaryRes.json();

  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error("Upload failed: " + JSON.stringify(data));
  }
};

// and adjust getSignature:
const getSignature = async (folder) => {
  const res = await axiosInstance.get(`${API_PATHS.IMAGE.GET_SIGNATURE}?folder=${folder}`);
  return res.data;
};


export default uploadImage;
