import useTranslation from 'hooks/useTranslation';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';

interface ICopyProps {
  children: React.ReactNode;
  text: string;
  onCopy?: (text: string, result: boolean) => void;
}

const CopyBox: React.FC<ICopyProps> = ({ children, text }) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text: string, result: any) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <>
      <CopyToClipboard text={text} onCopy={handleCopy}>
        <CopyContent className="copy-content">
          {children}
          {isCopied && <span className="tooltip-content">{t('general.Copied')}</span>}
        </CopyContent>
      </CopyToClipboard>
    </>
  );
};

export default CopyBox;

const CopyContent = styled.div`
  cursor: pointer;
  position: relative;
  .tooltip-content {
    position: absolute;
    padding: 5px 12px;
    border-radius: 8px;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    right: 30px;
    top: -5px;
    white-space: nowrap;
    background: #000;
    color: #fff;
    z-index: 99;
    font-size: 12px;
  }
  .tooltip-content::before {
    content: '';
    position: absolute;
    border: 6px solid transparent;
    border-bottom-color: #000;
    top: 10px;
    right: -6px;
    transform: translateX(50%) rotate(90deg);
  }
`;
