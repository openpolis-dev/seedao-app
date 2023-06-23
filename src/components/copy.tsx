import React, { useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';

interface ICopyProps {
  children: React.ReactElement;
  text: string;
  onCopy?: (text: string, result: boolean) => void;
}

const CopyBox: React.FC<ICopyProps> = ({ children, text, onCopy }) => {
  const target = useRef(null);

  const handleCopy = (text: string, result: any) => {
    onCopy && onCopy(text, result);
  };

  return (
    <>
      <CopyToClipboard text={text} onCopy={handleCopy}>
        <CopyContent ref={target}>{children}</CopyContent>
      </CopyToClipboard>
    </>
  );
};

export default CopyBox;

const CopyContent = styled.div`
  cursor: pointer;
`;
