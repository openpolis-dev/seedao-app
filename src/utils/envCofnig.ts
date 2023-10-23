const LOCAL = {
  REACT_APP_BASE_ENDPOINT: 'https://test-api.seedao.tech',
  REACT_APP_PUSH_ENDPOINT: 'https://test-push-api.seedao.tech',
  REACT_APP_MOBILE_URL: '',
  REACT_APP_MOBILE_OPEN: false,
  REACT_APP_ENV: 'test',
  REACT_APP_JOYID_ENABLE: true,
};
const DEVELOPMENT = {
  ...LOCAL,
  REACT_APP_ENV: 'test',
};

const PRODUCTION = {
  ...LOCAL,
  REACT_APP_BASE_ENDPOINT: 'https://api.seedao.tech',
  REACT_APP_PUSH_ENDPOINT: 'https://push-api.seedao.tech',
  REACT_APP_JOYID_ENABLE: false,
};

export default function getConfig() {
  switch (process.env.REACT_APP_ENV_VERSION) {
    case 'prod':
      return PRODUCTION;
    case 'dev':
      return DEVELOPMENT;
    default:
      return LOCAL;
  }
}
