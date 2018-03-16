import * as outgoing from './outgoing';

/**
 * Sets up an API that the configuration UI can use to perform configurations.
 * @param {*} bp
 * @param {*} configurator
 */
export function setUpApiForConfigUi(bp, configurator) {
  const router = bp.getRouter('botpress-hangouts-chat');

  router.get('/config', async (req, res) => {
    const config = await configurator.loadAll();
    res.json(config);
  });

  router.post('/config', async (req, res) => {
    const newConfig = req.body;
    await configurator.saveAll(newConfig);
    try {
      newConfig.privateKey = newConfig.privateKey.replace(/\\n/g, '\n');
      await outgoing.authGoogleClient(newConfig);
      res.status(200).send();
    } catch (err) {
      res.status(401).send();
    }
  });
}
