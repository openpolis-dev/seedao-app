import React from 'react';
import { quillModules } from 'utils/quillUtil';
import ReactQuill from 'react-quill';
import { MdPreview } from 'md-editor-rt';
import { useAuthContext } from '../../providers/authProvider';

interface QuillViewerProps {
  content: string;
}

export default function QuillViewer(props: QuillViewerProps) {
  const {
    state: { theme },
  } = useAuthContext();
  let str;
  try {
    str = JSON.parse(props.content);
    const delta = { ops: str };
    // const delta = { ops: JSON.parse(props.content) };
    const modules = quillModules();
    modules.toolbar = false;
    // @ts-ignore
    return <ReactQuill className={'quill-viewer'} value={delta} readOnly={true} modules={modules} />;
  } catch (e) {
    return <MdPreview modelValue={props.content} theme={theme ? 'dark' : 'light'} />;
  }
}
