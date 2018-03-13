# botpress-hangouts-chat

Hangouts Chat connector for Botpress

### Example usage

#### `index.js`

```javascript
module.exports = function(bp) {
  bp.hear(/ADDED_TO_SPACE_ROOM/i, (event, next) => {
    bp.hangoutsChat.sendMessage(
      event.space,
      `Thanks for adding me to ${event.space.displayName}!`
    );
  });
  bp.hear(/ADDED_TO_SPACE_DM/i, (event, next) => {
    bp.hangoutsChat.sendMessage(event.space, 'Thanks for adding me!');
  });
  bp.hear(/hello|hi|test|hey|hola/i, (event, next) => {
    bp.hangoutsChat.sendMessage(event.space, 'Hello human!');
  });
  bp.hear(
    {
      type: /message|text/i,
      text: /.+/i
    },
    (event, next) => {
      bp.hangoutsChat.sendMessage(event.space, `You said ${event.text}`);
    }
  );
};
```

## Installing

To use with your own bot, you have to install this module in your botpress
project

```
botpress install /path/to/botpress-hangouts-chat
```

Now you can use the `npm link` command to link the module with a symbolic link
(instead of having to re-install it at every change):

```
npm link /path/to/botpress-hangouts-chat
```

## Get started

To setup connexion of your chatbot to Hangouts Chat, you need to fill the
connexion settings. As of right now, you need to put these manually in your
`botfile.js`

```javascript
module.exports = {
  ...
  config: {
    'botpress-hangouts-chat': {
      client_email: '',
      private_key: '',
      verification_token: ''
    }
  },
  ...
```

`client_email` and `private_key` will be in the JSON private key that
Google Cloud gives you when you create a service account
(see [Hangouts Chat docs](https://developers.google.com/hangouts/chat/how-tos/service-accounts#creating_and_using_a_service_account)).
`verification_token` will be in the "API & Services" dashboard in your
Google Cloud developer console, in the Hangouts Chat API configuration
tab (see [Hangouts Chat docs](https://developers.google.com/hangouts/chat/how-tos/bots-develop#verifying_bot_authenticity)).

## Reference

### Incoming

You can listen to incoming event easily with Botpress by using `bp` built-in
`hear` function.

```javascript
bp.hear(
  { platform: 'hangouts-chat', type: 'message', text: 'Hello' },
  (event, next) => {
    bp.hangoutsChat.sendMessage(event.channel.id, 'Welcome!');
  }
);
```

Bellow is the information we provide in `event` for each type of event.
If you want more details about the `space` object, see the
[Hangouts Chat Docs](https://developers.google.com/hangouts/chat/reference/rest/v1/spaces).
Same for the
[raw event object](https://developers.google.com/hangouts/chat/reference/message-formats/events).

#### Added to space

If you're added to a room

```javascript
{
  type: 'added_to_room',
  platform: 'hangouts-chat',
  text: 'ADDED_TO_SPACE_ROOM',
  space: [Object],
  raw: [Object]
}
```

If you're added to an user's direct message

```javascript
{
  type: 'added_to_dm',
  platform: 'hangouts-chat',
  text: 'ADDED_TO_SPACE_DM',
  space: [Object],
  raw: [Object]
}
```

#### Message

An event is sent to middlewares for each incoming message from
Hangouts Chat (a DM or when someone in a room @ your bot) with all specific
information.

```javascript
{
  type: 'message',
  platform: 'hangouts-chat',
  text: [String],
  space: [Object],
  raw: [Object]
}
```

#### Removed from space

```javascript
{
  type: 'removed_from_space',
  platform: 'hangouts-chat',
  text: 'REMOVED_FROM_SPACE',
  space: [Object],
  raw: [Object]
}
```

### Outgoing

As of right now, with this module you can only send text messages. We expect
to support cards in the future.

#### Text

In code, it is simple to send a message text to a specific space
(see [Hangouts Chat docs](https://developers.google.com/hangouts/chat/reference/rest/v1/spaces.messages/create)).

##### `bp.hangoutsChat.sendMessage(space, text)`

##### Arguments

1.  `space` (Object): A Hangouts Chat Space object, corresponding to the space
    where you want to send a message, see [Hangouts Chat Docs for spaces](https://developers.google.com/hangouts/chat/reference/rest/v1/spaces).
1.  `text` (String): Text message that will be sent to `space`.

##### Returns

(Promise) The promise resolves when the message was successfully sent to
Hangouts Chat, and throws an error otherwise.
