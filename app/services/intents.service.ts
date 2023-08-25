import axios from "axios";
import { apiBase } from "../resources";

export async function getIntent(text: string) {
  const response = await axios.post(`${apiBase}/intents/text`, {
    message: text,
  });
  return response.data;
}
