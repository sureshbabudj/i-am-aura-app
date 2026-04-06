/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: 'widget',
  name: 'I Am Aura',
  icon: 'https://github.com/expo.png',
  entitlements: {
    'com.apple.security.application-groups': ['group.com.sureshbabudj.iamaura'],
  },
});
