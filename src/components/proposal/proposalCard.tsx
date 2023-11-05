import React, { useState, useEffect, useMemo } from 'react';
import { IBaseProposal } from 'type/proposal.type';
import styled from 'styled-components';
// import { useRouter } from 'next/router';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from 'utils/time';
import { useAuthContext } from 'providers/authProvider';

const CardBody = styled.div``;

export default function ProposalCard({ data }: { data: IBaseProposal }) {
  // const router = useRouter();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const {
    state: { theme },
  } = useAuthContext();

  const handleContent = async () => {
    let delta: any[] = [];
    try {
      delta = JSON.parse(data.first_post.content);
      console.log(delta);
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
    if (textContent == '<p><br/></p>') {
      textContent = '';
    }

    setContent(textContent);
  };

  useEffect(() => {
    data?.first_post.content && handleContent();
  }, [data?.first_post.content]);

  const openProposal = () => {
    navigate(`/proposal/thread/${data.id}`);
  };

  const borderStyle = useMemo(() => {
    return theme ? 'unset' : 'none';
  }, [theme]);
  return (
    <CardBox key={data.id} border={borderStyle}>
      <div onClick={openProposal}>
        <CardHeaderStyled>
          <div className="left">
            <UserAvatar src={data.user.photo_url} alt="" />
          </div>
          <div className="right">
            <div className="name">
              <span>{data.user.username}</span>
              {data.user.user_title?.name && (
                <UserTag bg={data.user.user_title.background}>{data.user.user_title?.name}</UserTag>
              )}
            </div>
            <div className="date">
              <Link to={`/proposal/category/${data.category_index_id}`}>#{data.category_name}</Link>
              <span className="dot-dot"> • </span>
              <span>{formatDate(new Date(data.updated_at))}</span>
            </div>
          </div>
        </CardHeaderStyled>
        <CardBody>
          <Title>{data.title}</Title>
          <ProposalContent dangerouslySetInnerHTML={{ __html: content }}></ProposalContent>
        </CardBody>
      </div>
    </CardBox>
  );
}

const CardBox = styled.div<{ border: string }>`
  border: ${(props) => props.border};
  cursor: pointer;
  background: var(--bs-box-background);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: var(--box-shadow);
`;

const CardHeaderStyled = styled.div`
  display: flex;
  gap: 10px;
  .name {
    font-size: 14px;
    font-family: Poppins-SemiBold, Poppins;
    color: var(--bs-body-color_active);
  }
  .date {
    font-size: 12px;
    color: var(--bs-body-color);
    padding-inline: 2px;
    margin-top: 5px;
  }
`;

const UserAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
`;

const Title = styled.div`
  font-weight: 600;
  margin-block: 16px;
  font-size: 16px;
  font-family: Poppins-SemiBold, Poppins;
  color: var(--bs-body-color_active);
`;

const ProposalContent = styled.div`
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 14px;
  color: var(--bs-body-color);
  .ql-editor p {
    line-height: 24px;
  }
`;

const UserTag = styled.span<{ bg: string }>`
  padding-inline: 8px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  color: #000;
  background-color: ${(props) => props.bg};
  border-radius: 6px;
  margin-left: 8px;
`;
