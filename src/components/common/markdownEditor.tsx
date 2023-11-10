import { MdEditor } from 'md-editor-rt';
import { useAuthContext } from 'providers/authProvider';
import { useMemo } from 'react';
import styled from 'styled-components';

const config = {
  toobars: [
    'bold',
    'underline',
    'italic',
    'strikeThrough',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'revoke',
    'next',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'htmlPreview',
  ],
  toolbarsExclude: ['github'],
};

interface IProps {
  value: string;
  onChange: (val: string) => void;
}
export default function MarkdownEditor({ value, onChange }: IProps) {
  const {
    state: { theme, language },
  } = useAuthContext();

  const lan = useMemo(() => {
    return language === 'zh' ? 'zh-CN' : 'en-US';
  }, [language]);
  return (
    <MdEditorStyle
      modelValue={value}
      onChange={onChange}
      theme={theme ? 'dark' : 'light'}
      toolbars={config.toobars as any}
      language={lan}
      codeStyleReverse={false}
      noUploadImg
    />
  );
}

const MdEditorStyle = styled(MdEditor)`
  .cm-scroller,
  .md-editor-preview-wrapper {
    background: var(--bs-background);
  }
`;
