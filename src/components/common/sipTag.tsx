import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function SipTag({ slug }: { slug: string }) {
  const [SIP, setSIP] = useState('');
  useEffect(() => {
    const getSIP = async () => {
      if (slug && slug.startsWith('sip-')) {
        setSIP(slug.split('-')[1]);
      }
    };
    getSIP();
  }, [slug]);
  if (!SIP) {
    return <></>;
  }
  return (
    <SipTagStyle href={`https://forum.seedao.xyz/thread/${slug}`} target="_blank" rel="noopener noreferrer">
      {`SIP-${SIP}`}
    </SipTagStyle>
  );
}

const SipTagStyle = styled.a`
  display: inline-block;
  border-radius: 5px;
  border: 1px solid #0085ff;
  font-size: 12px;
  padding: 2px 12px;
  color: #0085ff;
  &:hover {
    color: #0085ff;
  }
`;
