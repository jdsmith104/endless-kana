import LOADING_MESSAGES, { CircularBuffer } from './Loading.model';
import fisherYates, { getRandomNumber } from '../common/shuffle';

let buffer = new CircularBuffer<string>(LOADING_MESSAGES, LOADING_MESSAGES.length);

/**
 * Get random loading message
 * @returns Truely random loading message
 */
function getRandomLoadingMessage(): string {
  const index = getRandomNumber(LOADING_MESSAGES.length);
  return LOADING_MESSAGES[index];
}

/**
 * Get copy of loading messages
 * @returns loading messages array
 */
function getLoadingMessages(): string[] {
  return [...LOADING_MESSAGES];
}

function randomiseMessages(): void {
  const shuffledMessages = fisherYates(getLoadingMessages());
  buffer = new CircularBuffer<string>(shuffledMessages, shuffledMessages.length);
}

function getNextMessage(): string {
  return buffer.next();
}

export {
  getRandomLoadingMessage,
  randomiseMessages,
  getNextMessage,
};
