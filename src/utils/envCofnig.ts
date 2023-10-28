const VERSION = '0.1.1';

const LOCAL = {
  REACT_APP_BASE_ENDPOINT: 'https://test-api.seedao.tech',
  REACT_APP_PUSH_ENDPOINT: 'https://test-push-api.seedao.tech',
  REACT_APP_MOBILE_URL: '',
  REACT_APP_MOBILE_OPEN: false,
  REACT_APP_ENV: 'test',
  REACT_APP_JOYID_ENABLE: true,
  REAT_APP_ONESIGNAL_ID: '9c6122e1-3de4-4c03-8e68-9f357e9ca1ae',
  REACT_APP_APP_VERSION: `A ${VERSION}`,
};
const DEVELOPMENT = {
  ...LOCAL,
  REACT_APP_ENV: 'test',
  REAT_APP_ONESIGNAL_ID: '135980e7-6778-4bf8-9aac-dabc7fbd8e31',
};

const PREVIEW = {
  ...DEVELOPMENT,
  REACT_APP_BASE_ENDPOINT: 'https://preview-api.seedao.tech',
};

const PRODUCTION = {
  ...LOCAL,
  REACT_APP_BASE_ENDPOINT: 'https://api.seedao.tech',
  REACT_APP_PUSH_ENDPOINT: 'https://push-api.seedao.tech',
  REACT_APP_JOYID_ENABLE: false,
  REACT_APP_APP_VERSION: `B ${VERSION}`,
};

export default function getConfig() {
  switch (process.env.REACT_APP_ENV_VERSION) {
    case 'prod':
      return PRODUCTION;
    case 'preview':
      return PREVIEW;
    case 'dev':
      return DEVELOPMENT;
    default:
      return LOCAL;
  }
}
