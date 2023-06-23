import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '@paljs/ui/Card';
import { IBaseProposal } from 'type/proposal.type';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { formatDate } from 'utils/time';

export default function ProposalCard({ data }: { data: IBaseProposal }) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const handleContent = async () => {
    let delta: any[] = [];
    try {
      delta = JSON.parse(data.first_post.content);
    } catch (e) {
      console.info('illegal json:' + data.first_post.content);
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
    if (textContent == '<p><br/></p>') {
      textContent = '';
    }
    setContent(textContent);
  };

  useEffect(() => {
    data?.first_post.content && handleContent();
  }, [data?.first_post.content]);

  const openProposal = () => {
    router.push(`/proposal/thread/${data.id}`);
  };
  return (
    <Card size="Tiny" key={data.id}>
      <div onClick={openProposal}>
        <CardHeaderStyled>
          <div className="left">
            <UserAvatar src={data.user.photo_url} alt="" />
          </div>
          <div className="right">
            <div className="name">{data.user.username}</div>
            <div className="date">{formatDate(new Date(data.updated_at))}</div>
          </div>
        </CardHeaderStyled>
        <CardBody>
          <Title>{data.title}</Title>
          <ProposalContent dangerouslySetInnerHTML={{ __html: content }}></ProposalContent>
        </CardBody>
      </div>
    </Card>
  );
}

const CardHeaderStyled = styled.div`
  display: flex;
  gap: 10px;
  padding: 1rem 1.25rem;
  .name {
    font-weight: 500;
  }
  .date {
    font-size: 13px;
    color: #999;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 10px;
`;

const ProposalContent = styled.div`
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  .ql-editor p {
    line-height: 24px;
  }
`;
