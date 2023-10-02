import UAParser from 'ua-parser-js';

export const parser = new UAParser(window.navigator.userAgent);

const { type } = parser.getDevice();

export const isMobile = type === 'mobile' || type === 'tablet';
export const isPad = type === 'tablet';

const platform = parser.getOS().name;
export const isIOS = platform === 'iOS';
