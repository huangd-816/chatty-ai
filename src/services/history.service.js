// Per-companion conversation log (raw role/content turns).
// Behavior moved verbatim from server.js (keeps last 100 turns on save).
import { historyFile, readJson, writeJson } from '../store/fileStore.js';

export function getChatHistory(id) {
  return readJson(historyFile(id), []);
}

export function saveChatHistory(id, history) {
  writeJson(historyFile(id), history.slice(-100));
}
