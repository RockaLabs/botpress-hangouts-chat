/**
 * @typedef HangoutsChatSpace
 * @type {object}
 * @property {string} name
 * @property {"TYPE_UNSPECIFIED" | "ROOM" | "DM"} type
 * @property {string} displayName
 */

import { EventTypes } from './events';

/**
 * Creates an event object for interested outgoing middlewares.
 * @param {HangoutsChatSpace} space
 * @param {string} text
 */
export function createMessageOutgoingEvent(space, text) {
  return {
    platform: 'hangouts-chat',
    type: EventTypes.message,
    text: text,
    space: space,
    raw: { space, text }
  };
}
