import FormData from "form-data";
import fs from "fs";
import fetch, { Response } from "node-fetch";

export default async (
  url: string,
  method: string = "post",
  body = null,
  _headers = {},
  path: string = null
) => {
  body = method.toLowerCase() === "get" ? null : JSON.stringify(body);
  try {
    let response: Response;

    if (path) {
      body = new FormData();

      for (const param in body) body.append(param, body[param]);

      const { size: knownLength } = fs.statSync(path);
      const fileStream = fs.createReadStream(path);

      body.append("file", fileStream, { knownLength });

      response = await fetch(url, { method, body });
    } else {
      const headers = { "Content-Type": "application/json", ..._headers };
      response = await fetch(url, { method, body, headers });
    }

    return await response.json();
  } catch (e) {
    return false;
  }
};
