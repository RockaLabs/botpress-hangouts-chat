# botpress-hangouts-chat

Hangouts Chat connector for Botpress

## Example usage

### `index.js`

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

# Installing

We haven't published to npm, so please clone this repository somewhere
and compile it with `npm rum compile`. You can also run `npm run watch` to
automatically recompile when you make changes (useful when developing).
After that, you can install this module in your botpress project.

```
botpress install /path/to/botpress-hangouts-chat
```

Now you can use the `npm link` command to link the module with a symbolic link
(instead of having to re-install it at every change):

```
npm link /path/to/botpress-hangouts-chat
```

# Get started

To setup connexion of your chatbot to Hangouts Chat, you need to go to
`http://localhost:3000/modules/botpress-hangouts-chat` (change the port if
necessary) and enter your credentials.

`client_email` and `private_key` will be in the JSON private key that
Google Cloud gives you when you create a service account
(see [Hangouts Chat docs](https://developers.google.com/hangouts/chat/how-tos/service-accounts#creating_and_using_a_service_account)).
`verification_token` will be in the "API & Services" dashboard in your
Google Cloud developer console, in the Hangouts Chat API configuration
tab (see [Hangouts Chat docs](https://developers.google.com/hangouts/chat/how-tos/bots-develop#verifying_bot_authenticity)).

You also have to append `/api/botpress-hangouts-chat` at the end of the
"Bot URL" field in the connection settings of the Hangouts Chat API
configuration in your Google Cloud developer console (e.g. if your base
URL is `https://example.com`, then this field should contain
`https://example.com/api/botpress-hangouts-chat`.

# Reference

## Incoming

You can listen to incoming event easily with Botpress by using `bp` built-in
`hear` function.

```javascript
bp.hear(
  { platform: 'hangouts-chat', type: 'message', text: 'Hello' },
  (event, next) => {
    bp.hangoutsChat.sendMessage(event.space, 'Welcome!');
  }
);
```

Bellow is the information we provide in `event` for each type of event.
If you want more details about the Hangouts Chat objects, see the documentation
for:

* [Spaces](https://developers.google.com/hangouts/chat/reference/rest/v1/spaces)
  (sent as `event.space`)
* [Users](https://developers.google.com/hangouts/chat/reference/rest/v1/User)
  (sent as `event.user`)
* [Events](https://developers.google.com/hangouts/chat/reference/message-formats/events)
  (sent as `event.raw`)

### Added to space

If you're added to a room

```javascript
{
  type: 'added_to_room',
  platform: 'hangouts-chat',
  text: 'ADDED_TO_SPACE_ROOM',
  space: [Object],
  user: [Object],
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
  user: [Object],
  raw: [Object]
}
```

### Message

An event is sent to middlewares for each incoming message from
Hangouts Chat (a DM or when someone in a room @ your bot) with all specific
information.

```javascript
{
  type: 'message',
  platform: 'hangouts-chat',
  text: [String],
  space: [Object],
  user: [Object],
  thread: [String],
  raw: [Object]
}
```

### Removed from space

```javascript
{
  type: 'removed_from_space',
  platform: 'hangouts-chat',
  text: 'REMOVED_FROM_SPACE',
  space: [Object],
  user: [Object],
  raw: [Object]
}
```

## Outgoing

With this module you can send text messages and include cards. We don't support
card actions or buttons as of right now.

In code, it is simple to send a message text to a specific space
(see [Hangouts Chat docs](https://developers.google.com/hangouts/chat/reference/rest/v1/spaces.messages/create)).

##### `bp.hangoutsChat.sendMessage(space, text, cards)`

##### Arguments

1.  `space` (Object): A Hangouts Chat Space object, corresponding to the space
    where you want to send a message, see [Hangouts Chat Docs for spaces](https://developers.google.com/hangouts/chat/reference/rest/v1/spaces).
1.  `text` (String): Text message that will be sent to `space`.
1.  `cards` (Array of cards): The cards that will be sent. Defaults to
    `[]`. See below how to create cards.

##### Returns

* (Promise) The promise resolves with the response from the server
  when the message was successfully sent to Hangouts Chat, and throws an error
  otherwise.

### Creating cards

Cards in Hangouts Chat have a header and various sections. Each section is
composed of widgets. See more information about cards in the
[Hangouts Chat documentation](https://developers.google.com/hangouts/chat/reference/rest/v1/cards).

#### Card

##### `bp.hangoutsChat.cards.createCard({ header, sections })`

##### Arguments

* `header` (Card header object): The cards's header. Defaults to `{}`.
* `sections` (Array of section objects): The sections of the card. Defaults to
  `[]`.

##### Returns

* (Object) A card object.

#### Card header

##### `bp.hangoutsChat.cards.createCardHeader({ title, subtitle, imageStyle, imageUrl })`

##### Arguments

* `title` (String): The header's title. Defaults to `''`.
* `subtitle` (String): The header's subtitle. Defaults to `''`.
* `imageStyle` ('IMAGE' | 'AVATAR'): The header's image style. 'IMAGE' means
  square border, 'AVATAR' means circular border. Defaults to `undefined`.
* `imageUrl` (String): The header's image. Defaults to `undefined`.

##### Returns

* (Object) A card header object.

#### Section

##### `bp.hangoutsChat.cards.createSection({ header, widgets })`

##### Arguments

* `header` (String): The section's title, text formatting supported.
  Defaults to `''`.
* `widgets` (Array of widgets): The widgets of the section. Defaults to `[]`.

##### Returns

* (Object) A section object.

#### Text paragraph widget

##### `bp.hangoutsChat.cards.createTextParagraphWidget(text)`

##### Arguments

* `text` (String): Text to be displayed, text formatting supported.
  Defaults to `''`.

##### Returns

* (Object) A widget object.

#### Image widget

##### `bp.hangoutsChat.cards.createImageWidget({ imageUrl, aspectRatio })`

##### Arguments

* `imageUrl` (String): The URL of the image.
* `aspectRatio` (Number): The aspect ratio of this image (width/height).
  Defaults to `undefined`, meaning the original aspect ratio.

##### Returns

* (Object) A widget object.

#### KeyValue widget

##### `bp.hangoutsChat.cards.createKeyValueWidget({ topLabel, content, contentMultiline, bottomLabel, icon })`

##### Arguments

* `topLabel` (String): The text of the top label. Formatted text supported.
  Defaults to `''`.
* `content` (String): The text of the content. Formatted text supported.
  Defaults to `''`.
* `contentMultiline` (Boolean): If the content should be multiline.
  Defaults to `false`.
* `bottomLabel` (String): The text of the bottom label. Formatted text
  supported. Defaults to `''`.
* `icon` (String): An [enum value](https://developers.google.com/hangouts/chat/reference/message-formats/cards#builtinicons)
  that will be replaced by the Chat API with the corresponding icon image.
  Defaults to `undefined`.

##### Returns

* (Object) A widget object.

#### Example

```javascript
// Create a section with a text paragraph widget and a key-value widget
const textWidget = bp.hangoutsChat.cards.createTextParagraphWidget(
  '<b>Roses</b> are <font color="#ff0000">red</font>,<br><i>Violets</i> are <font color="#0000ff">blue</font>'
);
const keyValueWidget = bp.hangoutsChat.cards.createKeyValueWidget({
  topLabel: 'Key',
  content: 'Value',
  icon: 'STAR'
});
const textSection = bp.hangoutsChat.cards.createSection({
  header: 'Text header',
  widgets: [textWidget, keyValueWidget]
});

// Create a section with an image widget
const imageWidget = bp.hangoutsChat.cards.createImageWidget({
  imageUrl: 'http://oi40.tinypic.com/flevpd.jpg'
});
const imageSection = bp.hangoutsChat.cards.createSection({
  header: 'Image header',
  widgets: [imageWidget]
});

// Create the card's header
const header = bp.hangoutsChat.cards.createCardHeader({
  title: 'Title',
  subtitle: 'Subtitle'
});

// Create a card
const card = bp.hangoutsChat.cards.createCard({
  header,
  sections: [textSection, imageSection]
});

// Note that you must always pass an array of cards to hangoutsChat.sendMessage
bp.hangoutsChat.sendMessage(event.space, '', [card]);
```

### Creating actions without sending them

You can create middleware events without sending them to the outgoing
middleware. This is useful for example in conversations:

```javascript
// This message won't be sent
const message = bp.hangoutsChat.createMessage(event.space, 'Hello!');
// But `message` is a fully formed middleware event object, ready to be sent
convo.threads['default'].addMessage(message);
```
