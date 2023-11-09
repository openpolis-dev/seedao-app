import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProposalDetail } from 'requests/proposal';

export default function SipTag({ threadId }: { threadId: number }) {
  const [SIP, setSIP] = useState('');
  const [slug, setSlug] = useState('');
  useEffect(() => {
    const getSIP = async () => {
      getProposalDetail(threadId).then((res) => {
        const slug = res.data.thread?.slug;
        if (slug && slug.startsWith('sip-')) {
          setSIP(slug.split('-')[1]);
          setSlug(slug);
        }
      });
    };
    getSIP();
  }, [threadId]);
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
