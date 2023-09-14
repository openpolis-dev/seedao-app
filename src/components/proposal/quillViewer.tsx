import React from 'react';
import { quillModules } from 'utils/quillUtil';
import ReactQuill from 'react-quill';

interface QuillViewerProps {
  content: string;
}

export default function QuillViewer(props: QuillViewerProps) {
  const delta = { ops: JSON.parse(props.content) };
  const modules = quillModules();
  modules.toolbar = false;
  // @ts-ignore
  return <ReactQuill className={'quill-viewer'} value={delta} readOnly={true} modules={modules} />;
}
