// src/utils/tokenUtils.js

export function isTokenFresh(bufferMs = 2 * 60 * 1000) {
  const expiry = localStorage.getItem('access_token_expiry');
  if (!expiry) return false;
  return Date.now() < Number(expiry) - bufferMs;
}