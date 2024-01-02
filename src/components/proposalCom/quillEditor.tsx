import React, { useEffect, useRef } from 'react';
import ReactQuill, { UnprivilegedEditor, Value } from 'react-quill';
import { Sources } from 'quill';
import { quillModules } from 'utils/quillUtil';

import { boldIcon, italicIcon, olIcon, ulIcon, underlineIcon } from 'components/svgs/editorSVG';
import 'react-quill/dist/quill.snow.css';
import 'assets/styles/quill.css';
import styled from 'styled-components';
import { useAuthContext } from '../../providers/authProvider';

const modules = quillModules();
modules.toolbar = {
  container: `#see-toolbar`,
};

const toolIcons = ReactQuill.Quill.import('ui/icons');

const IconSize = 20;
toolIcons['bold'] = boldIcon(IconSize);
toolIcons['italic'] = italicIcon(IconSize);
toolIcons['underline'] = underlineIcon(IconSize);
toolIcons['list']['ordered'] = olIcon(IconSize);
toolIcons['list']['bullet'] = ulIcon(IconSize);

interface QuillEditorProps {
  widgetKey: string;
  onChange: (value: string, source: Sources, editor: UnprivilegedEditor) => void;
  value?: Value;
  disabled?: boolean;
  toolbarWidgets?: JSX.Element;
  onClose?: (widgetKey: string) => void;
}

export default function QuillEditor(props: QuillEditorProps) {
  const inputRef = useRef(null);
  const {
    state: { theme },
  } = useAuthContext();
  useEffect(() => {
    if (inputRef != null && inputRef.current != null) {
      // @ts-ignore
      const quill = inputRef.current as ReactQuill;
      quill.setEditorSelection(quill.getEditor(), { index: quill.getEditor().getLength(), length: 0 });
    }
  }, []);

  const handleChange = (value: string, delta: any, source: Sources, editor: UnprivilegedEditor) => {
    props.onChange(value, source, editor);
  };

  const iconStyle = {
    color: 'var(--bs-primary)',
  };
  const CustomToolbar = () => (
    <div className={'mf-ql-toolbar'}>
      {props.toolbarWidgets}
      <div id="see-toolbar">
        <span className={'ql-formats'}>
          <button className="ql-bold" style={iconStyle} />
          <button className="ql-italic" style={iconStyle} />
          <button className="ql-underline" style={iconStyle} />
          {/*<button className="ql-strike" style={iconStyle}/>*/}
        </span>
        <span className={'ql-formats'}>
          <button className="ql-list" value="ordered" style={iconStyle} />
          <button className="ql-list" value="bullet" style={iconStyle} />
        </span>
      </div>
    </div>
  );

  // @ts-ignore
  return (
    <EditorStyle className={'mf-ql-editor'} theme={theme.toString()}>
      <ReactQuill
        className={'quill-editor'}
        readOnly={props.disabled}
        value={props.value}
        onChange={handleChange}
        modules={modules}
        ref={inputRef}
      />
      {CustomToolbar()}
    </EditorStyle>
  );
}

const EditorStyle = styled.div<{ theme: string }>`
  border: 1px solid var(--bs-primary);
  .ql-container.ql-snow {
    border: none;
  }
  svg {
    fill: ${(props) => (props.theme === 'true' ? '#fff' : '#000')};
  }
`;
