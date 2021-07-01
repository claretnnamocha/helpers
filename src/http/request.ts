import fetch from "node-fetch";
import { request } from "../types";

export default async (params: request.request) => {
  try {
    const { url, returns = "json", query = {} } = params;

    delete params.url;
    delete params.returns;

    let fullUrl = url;

    if (Object.keys(query).length) {
      const qs = Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join("&");

      fullUrl += `?${qs}`;
    }

    const response = await fetch(fullUrl, params);

    switch (returns) {
      case "json":
        return response.json();

      default:
        return response.text();
    }
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
