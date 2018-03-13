import { EventTypes } from './events';

/**
 * Sets up the botpress incoming middleware. As per the Hangouts Chat API,
 * the events are sent to the bot as POST. The endpoint that recieves these is
 * /api/botpress-hangouts-chat
 * @param {*} bp
 * @param {string} verificationToken Verification token from Google
 */
export function setUpIncomingEvents(bp, verificationToken) {
  const router = bp.getRouter('botpress-hangouts-chat');
  router.post('/', (req, res) => {
    const event = req.body;
    if (!event || !event.type || !event.token) {
      return res.status(400).end();
    }
    if (event.token !== verificationToken) {
      return res.status(401).end();
    }
    switch (event.type) {
      case 'ADDED_TO_SPACE': {
        if (event.space.type === 'ROOM') {
          bp.middlewares.sendIncoming({
            type: EventTypes.addedToRoom,
            platform: 'hangouts-chat',
            text: 'ADDED_TO_SPACE_ROOM',
            space: event.space,
            raw: event
          });
        } else if (event.space.type === 'DM') {
          bp.middlewares.sendIncoming({
            type: EventTypes.addedToDm,
            platform: 'hangouts-chat',
            text: 'ADDED_TO_SPACE_DM',
            space: event.space,
            raw: event
          });
        }
        break;
      }
      case 'MESSAGE': {
        bp.middlewares.sendIncoming({
          type: EventTypes.message,
          platform: 'hangouts-chat',
          text: event.message.text,
          space: event.space,
          raw: event
        });
        break;
      }
      case 'REMOVED_FROM_SPACE': {
        bp.middlewares.sendIncoming({
          type: EventTypes.removedFromSpace,
          platform: 'hangouts-chat',
          text: 'REMOVED_FROM_SPACE',
          space: event.space,
          raw: event
        });
        break;
      }
      default: {
        return res.status(400).end();
      }
    }
    res.status(200).end();
  });
}
