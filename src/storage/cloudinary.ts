import { v2 as cloudinary } from "cloudinary";
import { fromBuffer } from "file-type";
import fs from "fs";
import { DATAURI_REGEX } from "../types/storage";

export const upload = async (payload: any) => {
  try {
    const upload = await cloudinary.uploader.upload(payload.path);

    const { mime } = await fromBuffer(fs.readFileSync(payload.path));

    return { url: upload.secure_url, mime };
  } catch (error) {
    return false;
  }
};

export const uploadBase64 = async (payloadString: string) => {
  try {
    const { mime } = await fromBuffer(
      Buffer.from(payloadString.replace(DATAURI_REGEX, ""), "base64")
    );
    payloadString = payloadString.startsWith("data:")
      ? payloadString
      : `data:${mime};base64,${payloadString}`;

    const upload = await cloudinary.uploader.upload(payloadString);
    return { url: upload.secure_url, mime };
  } catch (error) {
    return false;
  }
};
