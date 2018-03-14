/**
 * @typedef HangoutsChatSpace
 * @type {object}
 * @property {string} name
 * @property {"TYPE_UNSPECIFIED" | "ROOM" | "DM"} type
 * @property {string} displayName
 *
 * @typedef GoogleJsonKeys
 * @type {object}
 * @property {string} client_email
 * @property {string} private_key
 */

import { google } from 'googleapis';

let authClient;

/**
 * @param {string} spaceName
 */
const sendMessageApiEndpoint = spaceName =>
  `https://chat.googleapis.com/v1/${spaceName}/messages`;

/**
 * Authorizes the Google API client. You must call this before using any other
 * method in this module.
 * @param {GoogleJsonKeys} keys
 * @returns {Promise<void>} Nothing, treat as a Promise
 */
export async function authGoogleClient(keys) {
  if (!keys || !keys.client_email || !keys.private_key) {
    throw new Error('You need to specify config');
  }

  try {
    authClient = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key,
      ['https://www.googleapis.com/auth/chat.bot']
    );
    await authClient.authorize();
  } catch (err) {
    throw err;
  }
}

/**
 * Sends a message to the specified space.
 * See https://developers.google.com/hangouts/chat/reference/rest/v1/spaces.messages/create
 * for more info.
 * @param {HangoutsChatSpace} space
 * @param {string} message
 * @returns {Promise<void>} Nothing, treat as a Promise
 */
export async function sendMessage(space, message) {
  try {
    const endpoint = sendMessageApiEndpoint(space.name);
    const apiRequest = await authClient.request({
      url: endpoint,
      method: 'post',
      data: {
        text: message
      }
    });
    if (apiRequest.status !== 200) {
      throw new Error(
        `Something went wrong sending the message. Server said ${
          apiRequest.status
        }-${apiRequest.statusText}`
      );
    }
  } catch (err) {
    throw err;
  }
}
