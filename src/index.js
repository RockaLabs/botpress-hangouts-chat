import * as outgoing from './outgoing';

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
  }
};

export async function init(bp, configurator) {
  const config = await configurator.loadAll();
  await outgoing.authGoogleClient(config);

  bp.hangoutsChat = {};
  bp.hangoutsChat.sendMessage = outgoing.sendMessage;
}

export async function ready(bp, configurator) {
  const router = bp.getRouter('botpress-hangouts-chat');

  // https://.../api/botpress-hangouts-chat
  router.post('/', async (req, res) => {
    const event = req.body;
    if (!event || !event.type) {
      return res.status(400).end();
    }
    switch (event.type) {
      case 'ADDED_TO_SPACE': {
        bp.middlewares.sendIncoming({
          type: 'added_to_space',
          platform: 'hangouts-chat',
          text: 'ADDED_TO_SPACE',
          space: event.space,
          raw: event
        });
        break;
      }
      case 'MESSAGE': {
        bp.middlewares.sendIncoming({
          type: 'message',
          platform: 'hangouts-chat',
          text: event.message.text,
          space: event.space,
          raw: event
        });
        break;
      }
      case 'REMOVED_FROM_SPACE': {
        return res.status(200).end();
      }
      default: {
        return res.status(400).end();
      }
    }
    res.status(200).end();
  });
}
