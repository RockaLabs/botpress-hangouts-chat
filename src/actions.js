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
 * @param {HangoutsChatSpace} space Space where the message will be sent
 * @param {string} text Message text
 * @param {?Array<object>} cards Optional cards that will be sent in the message
 */
export function createMessageOutgoingEvent(spaceName, text, cards = undefined) {
  const event = {
    platform: 'hangouts-chat',
    type: EventTypes.message,
    text: text,
    spaceName: spaceName,
    raw: { spaceName, text }
  };
  if (cards) {
    event.cards = cards;
    event.raw.cards = cards;
  }
  return event;
}
