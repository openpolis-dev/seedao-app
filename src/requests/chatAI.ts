import axios from "axios";

export const getAllModels = async () => {
  const response = await axios.get(`${process.env.REACT_APP_DEEPSEEK_API_URL}/api/models`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_DEEPSEEK_API_KEY}`
    }
  });

  return response.data.data;
}


export const chatCompletions = async (obj:string,abortController: typeof AbortController.prototype) => {

  const response = await fetch(`${process.env.REACT_APP_DEEPSEEK_API_URL}/api/chat/completions`, {
    "headers": {
      "content-type": "application/json",
      'Authorization': `Bearer ${process.env.REACT_APP_DEEPSEEK_API_KEY}`
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
