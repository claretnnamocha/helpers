import { v2 as cloudinary } from "cloudinary";
import { fromBuffer } from "file-type";

export const upload = async (payload: any) => {
  try {
    const upload = await cloudinary.uploader.upload(payload.path);
    return upload.secure_url;
  } catch (error) {
    return false;
  }
};

export const uploadBase64 = async (payloadString: string) => {
  try {
    const mimeInfo = await fromBuffer(Buffer.from(payloadString, "base64"));
    payloadString = payloadString.startsWith("data:")
      ? payloadString
      : `data:${mimeInfo.mime};base64,${payloadString}`;

    const upload = await cloudinary.uploader.upload(payloadString);
    return upload.secure_url;
  } catch (error) {
    return false;
  }
};
