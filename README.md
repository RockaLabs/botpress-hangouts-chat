# botpress-hangouts-chat

Hangouts Chat connector for Botpress

## Testing locally

To use with your own bot, you have to install this module in your botpress project

```
botpress install /path/to/botpress-hangouts-chat
```

Now you can use the npm link command to link the module with a symbolic link
(instead of having to re-install it at every change):

```
npm link /path/to/botpress-hangouts-chat
```

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
