import axios, { AxiosResponse } from 'axios';
import { Signature, UNABLE_TO_RETRIEVE } from './types';

export async function fetchBlock(
  endpoint: string,
  height: number,
  signature: Signature
) {
  return await requestSidecarAPI(`${endpoint}/blocks/${height}`, signature);
}

export function isHeightOutOfRange(err: any): boolean {
  if (err.isAxiosError) {
    const response: AxiosResponse = err.response;

    if (response && response.data && response.data.message) {
      if (response.data.message === UNABLE_TO_RETRIEVE) {
        return true;
      }
    }
  }

  return false;
}

async function requestSidecarAPI(endpoint: string, signature: Signature) {
  const { data } = await axios.get(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Signature: signature.signature,
      'Public-Key': signature.pubKey,
      'Pool-ID': signature.poolId,
      Timestamp: signature.timestamp,
    },
  });

  return data;
}
