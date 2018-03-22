/**
 * @typedef GoogleJsonKeys
 * @type {object}
 * @property {string} clientEmail
 * @property {string} privateKey
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
  if (!keys || !keys.clientEmail || !keys.privateKey) {
    console.log('Please enter your credentials in the module UI');
    return;
  }

  try {
    authClient = new google.auth.JWT(keys.clientEmail, null, keys.privateKey, [
      'https://www.googleapis.com/auth/chat.bot'
    ]);
    await authClient.authorize();
  } catch (err) {
    throw err;
  }
}

/**
 * Sends a message to the specified space.
 * See https://developers.google.com/hangouts/chat/reference/rest/v1/spaces.messages/create
 * for more info. Throws if the HTTP status code from the response is different
 * than 200.
 * @param {string} spaceName Space where the message will be sent, has the form 'space/*'
 * @param {string} message Message text
 * @param {?Array<object>} cards Optional cards that will be sent in the message
 * @returns {Promise<*>} Response from Hangouts Chat
 */
export async function sendMessage(spaceName, message, cards = undefined) {
  try {
    const endpoint = sendMessageApiEndpoint(spaceName);
    const reqBody = { text: message };
    if (cards) {
      reqBody.cards = cards;
    }
    const apiRequest = await authClient.request({
      url: endpoint,
      method: 'post',
      data: reqBody
    });
    if (apiRequest.status !== 200) {
      throw new Error(
        `Something went wrong sending the message. Server said ${
          apiRequest.status
        }-${apiRequest.statusText}`
      );
    }
    return apiRequest.data;
  } catch (err) {
    throw err;
  }
}
