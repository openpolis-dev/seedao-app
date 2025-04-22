import request from "./http";

const PATH_PREFIX = '/user';
export const DEEPSEEK_API_URL ="https://ds.seedao.tech/v1"

export const chatCompletions = async (obj:string,abortController: typeof AbortController.prototype,apiKey:string) => {

  const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
    "headers": {
      "content-type": "application/json",
      'X-API-Key': apiKey
    },

    "body": obj,
    "method": "POST",
    signal: abortController.signal,
    // "mode": "cors",
    // "credentials": "include"
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response;
}


export const getNewToken = async () => {
  return request.post(`${PATH_PREFIX}/refresh/dsapikey`);
}

export const loginChat = async () => {
  return request.post(`${PATH_PREFIX}/auth/dschat`);
}

