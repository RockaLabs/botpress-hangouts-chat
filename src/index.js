import * as incoming from './incoming';
import * as outgoing from './outgoing';
import * as umm from './umm';
import * as actions from './actions';
import * as configUi from './configUi';
import * as cards from './cards';
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
      outgoing.sendMessage(event.space, event.text, event.cards);
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
  bp.hangoutsChat.sendMessage = async (space, message, cards = undefined) =>
    bp.middlewares.sendOutgoing(
      actions.createMessageOutgoingEvent(space, message, cards)
    );
  bp.hangoutsChat.createMessage = actions.createMessageOutgoingEvent;
  bp.hangoutsChat.cards = cards;

  umm.registerUmmConnector(bp);
}

export async function ready(bp, configurator) {
  const config = await configurator.loadAll();
  try {
    config.privateKey = config.privateKey.replace(/\\n/g, '\n');
    await outgoing.authGoogleClient(config);
  } catch (e) {
    console.log(
      'Hangouts Chat error: Something went wrong authenticating, check your credentials'
    );
  }
  incoming.setUpIncomingEvents(bp, config.verificationToken);
  configUi.setUpApiForConfigUi(bp, configurator);
}
