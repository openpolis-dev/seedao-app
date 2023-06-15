import { StringMap } from 'quill';

export const quillModules = (): StringMap => {
  return {
    clipboard: {
      matchVisual: false,
    },
    markdownOptions: {},
    mention: {},
    'emoji-textarea': true,
  };
};

export default {};
