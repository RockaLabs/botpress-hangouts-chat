import * as incoming from './incoming';
import * as outgoing from './outgoing';
import * as umm from './umm';
import * as actions from './actions';
import { EventTypes } from './events';

function outgoingMiddleware(event, next) {
  if (event.platform !== 'hangouts-chat') {
    return next();
  }

  switch (event.type) {
    case 'message': {
      if (!event.space) {
        return next(`Space missing in message event`);
      }
      outgoing.sendMessage(event.space, event.text);
      break;
    }
    default: {
      return next(`Unsupported event type: ${event.type}`);
    }
  }
}

export const config = {
  clientEmail: {
    type: 'string',
    required: true,
    env: 'GOOGLE_CLIENT_EMAIL',
    default: ''
  },
  privateKey: {
    type: 'string',
    required: true,
    env: 'GOOGLE_PRIVATE_KEY',
    default: ''
  },
  verificationToken: {
    type: 'string',
    required: true,
    env: 'HANGOUTS_CHAT_BOT_VERIFICATION_TOKEN',
    default: ''
  }
};

export function init(bp, configurator) {
  bp.middlewares.register({
    name: 'hangousChat.sendMessages',
    type: 'outgoing',
    order: 100,
    handler: outgoingMiddleware,
    module: 'botpress-hangouts-chat',
    description:
      'Sends out messages that targets platform = hangouts-chat. This middleware should be placed at the end as it swallows events once sent.'
  });

  bp.hangoutsChat = {};
  bp.hangoutsChat.sendMessage = async (space, message) =>
    bp.middlewares.sendOutgoing(
      actions.createMessageOutgoingEvent(space, message)
    );
  bp.hangoutsChat.createMessage = actions.createMessageOutgoingEvent;

  umm.registerUmmConnector(bp);
}

export async function ready(bp, configurator) {
  const config = await configurator.loadAll();
  await outgoing.authGoogleClient(config);
  incoming.setUpIncomingEvents(bp, config.verification_token);
}
