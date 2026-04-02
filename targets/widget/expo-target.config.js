module.exports = (config) => ({
  type: 'widget',
  icon: 'https://github.com/expo.png',
  entitlements: {
    'com.apple.security.application-groups': ['group.com.sureshbabudj.iamaura'],
  },
  colors: {
    accent: '#FF6B35',
  },
  // No additional resources needed - we use App Groups for data sharing
});
