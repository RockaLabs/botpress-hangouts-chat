import * as incoming from './incoming';
import * as outgoing from './outgoing';
import { EventTypes } from './events';

export const config = {
  client_email: {
    type: 'string',
    required: true,
    env: 'GOOGLE_CLIENT_EMAIL',
    default: ''
  },
  private_key: {
    type: 'string',
    required: true,
    env: 'GOOGLE_PRIVATE_KEY',
    default: ''
  },
  verification_token: {
    type: 'string',
    required: true,
    env: 'HANGOUTS_CHAT_BOT_VERIFICATION_TOKEN',
    default: ''
  }
};

export async function init(bp, configurator) {
  const config = await configurator.loadAll();
  await outgoing.authGoogleClient(config);

  bp.hangoutsChat = {};
  bp.hangoutsChat.sendMessage = outgoing.sendMessage;
}

export async function ready(bp, configurator) {
  const config = await configurator.loadAll();
  incoming.setUpIncomingEvents(bp, config.verification_token);
}
