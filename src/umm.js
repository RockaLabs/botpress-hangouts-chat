/**
 * @typedef Instructions
 * @type {object}
 * @property {?string} text
 *
 * @typedef UmmOutgoing
 * @type {object}
 * @property {*} event
 * @property {string} blocName
 * @property {Instructions} instruction
 */

import * as actions from './actions';

/**
 * Processes the outgoing event with the UMM instructions.
 * @param {UmmOutgoing} args
 */
function processOutgoing({ event, blocName, instruction }) {
  if ('text' in instruction) {
    return actions.createMessageOutgoingEvent(
      event.space.name,
      instruction.text
    );
  }

  const unrecognizedInstruction = { ...instruction };
  if ('text' in instruction) delete unrecognizedInstruction.text;
  throw new Error(
    `Unrecognized instruction on Slack in bloc '${blocName}': ${unrecognizedInstruction}`
  );
}

/**
 * Registers an UMM connector so that we can handle UMM replies.
 * @param {*} bp
 */
export function registerUmmConnector(bp) {
  const { umm } = bp;
  if (umm && umm.registerConnector) {
    umm.registerConnector({
      platform: 'hangouts-chat',
      processOutgoing: args => processOutgoing({ ...args, bp }),
      templates: []
    });
  }
}
