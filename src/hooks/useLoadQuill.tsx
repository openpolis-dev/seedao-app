import React, { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';

export default function useLoadQuill() {
  const [enableQuill, setEnableQuill] = useState(false);
  const loadQuill = async () => {
    const Quill = await require('quill');
    // @ts-ignore
    const QuillMarkdown = await import('quilljs-markdown');
    // @ts-ignore
    const QuillMention = await import('quill-mention');
    // @ts-ignore
    const Emoji = await import('quill-emoji');

    const Parchment = await Quill.import('parchment');
    // @ts-ignore
    class ShiftEnterBlot extends Parchment.Embed {} // Actually EmbedBlot
    ShiftEnterBlot.blotName = 'ShiftEnter';
    ShiftEnterBlot.tagName = 'br';
    Quill.register(ShiftEnterBlot);

    // @ts-ignore
    class HrBlot extends Parchment.Embed {} // Actually EmbedBlot
    HrBlot.blotName = 'hr';
    HrBlot.tagName = 'br';
    Quill.register(HrBlot);

    Quill.register('modules/markdownOptions', QuillMarkdown.default, true);
    Quill.register('modules/mention', QuillMention?.default, true);
    Quill.register('modules/emoji', Emoji?.default, true);
    setEnableQuill(true);
  };

  useEffect(() => {
    loadQuill();
  }, []);
  return enableQuill;
}
