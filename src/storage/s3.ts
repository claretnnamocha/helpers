import S3 from "aws-sdk/clients/s3";
import { fromBuffer } from "file-type";
import fs from "fs";
import { v4 as uuid } from "uuid";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } =
  process.env;

const s3 = new S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

export const upload = async (payload: any) => {
  const Body = fs.readFileSync(payload.path);

  try {
    const upload: any = s3.upload({
      Bucket: AWS_BUCKET_NAME,
      Key: uuid(),
      Body,
    });

    return upload.Location;
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

    const upload: any = s3.upload({
      Bucket: AWS_BUCKET_NAME,
      Key: uuid(),
      Body: payloadString,
      ContentEncoding: "base64",
      ContentType: mimeInfo.mime,
    });

    return upload.Location;
  } catch (error) {
    return false;
  }
};
