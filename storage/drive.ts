import { fromBuffer, fromFile } from "file-type";
import fs from "fs";
import { google } from "googleapis";
import stream from "stream";
import { v4 as uuid } from "uuid";

const {
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
  GOOGLE_REFRESH_TOKEN,
} = process.env;

const authenticate = () => {
  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

  return google.drive({ version: "v3", auth });
};

export const upload = async (payload: any) => {
  try {
    const mimeInfo = await fromFile(payload.path);

    const drive = authenticate();
    const requestBody = { name: `${uuid()}.${mimeInfo.ext}` };

    const media = {
      mimeType: mimeInfo.mime,
      body: fs.createReadStream(payload.path),
    };

    const upload = await drive.files.create({ requestBody, media });
    return upload;
  } catch (error) {
    return false;
  }
};

export const uploadBase64 = async (payloadString: string) => {
  try {
    const buffer = Buffer.from(payloadString, "base64");

    const mimeInfo = await fromBuffer(buffer);
    payloadString = payloadString.startsWith("data:")
      ? payloadString
      : `data:${mimeInfo.mime};base64,${payloadString}`;

    const drive = authenticate();
    const requestBody = { name: `${uuid()}.${mimeInfo.ext}` };

    const body = new stream.PassThrough();
    body.end(buffer);

    const media = { mimeType: mimeInfo.mime, body };

    const upload = await drive.files.create({ requestBody, media });

    return upload;
  } catch (error) {
    return false;
  }
};
