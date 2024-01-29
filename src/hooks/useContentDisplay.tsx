import { MdPreview } from 'md-editor-rt';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export const parseContent = async (content: string) => {
  let delta: any[] = [];
  try {
    delta = JSON.parse(content);
  } catch (e) {
    // console.info('illegal json:' + JSON.stringify(data));
  }

  const text: any[] = [];
  let totalTextLength = 0;

  for (let i = 0; i < delta.length; i++) {
    // for videos and images
    if (delta[i] && delta[i].insert && typeof delta[i].insert === 'object') {
      // delta.splice(i, 1)
      // for text
    } else if (delta[i] && delta[i].insert && typeof delta[i].insert === 'string') {
      // if we already have 6 lines or 200 characters. that's enough for preview
      if (text.length >= 6 || totalTextLength > 200) {
        continue;
      }

      // it's just newline and space.
      if (delta[i].insert.match(/^[\n\s]+$/)) {
        // if the previous line doesn't end with newline mark, we can add one newline mark
        // otherwise just ignore it
        if (!text[i - 1] || (typeof text[i - 1].insert === 'string' && !text[i - 1].insert.match(/\n$/))) {
          text.push({ insert: '\n' });
        }
      } else {
        // if text end with multiple newline mark, leave only one
        if (delta[i].insert.match(/\n+$/)) {
          delta[i].insert = delta[i].insert.replace(/\n+$/, '\n');
        }
        text.push(delta[i]);
        totalTextLength = totalTextLength + delta[i].insert.length;
      }
    }
  }
  // post content is always a json string of Delta, we need to convert it html
  const QuillDeltaToHtmlConverter = await require('quill-delta-to-html');
  const converter: any = new QuillDeltaToHtmlConverter.QuillDeltaToHtmlConverter(text, {});
  let textContent = converter.convert();
  if (textContent === '<p><br/></p>') {
    textContent = '';
  }
  console.log('=======1', content);
  console.log('=======2', textContent);

  return textContent;
};

export default function useContentDisplay(content: string, noNeedParse: boolean, theme: boolean) {
  const [contentValue, setContentValue] = useState<string>('');

  useEffect(() => {
    if (content?.includes('insert')) {
      const _parse = async () => {
        try {
          setContentValue(await parseContent(content));
        } catch (error) {}
      };
      _parse();
    }
  }, [content]);
  if (content?.includes('insert')) {
    return <Content className="content" dangerouslySetInnerHTML={{ __html: contentValue }}></Content>;
  } else {
    return (
      <Content>
        <MdPreview theme={theme ? 'dark' : 'light'} modelValue={content || ''} />
      </Content>
    );
  }
}

const Content = styled.div`
  color: var(--bs-body-color_active);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  .md-editor-preview-wrapper {
    padding: 0 !important;
    * {
      font-size: 14px;
      color: var(--bs-body-color_active);
    }
  }
`;
