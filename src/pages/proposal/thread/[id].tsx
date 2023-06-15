import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import requests from 'requests';
import { IBaseProposal } from 'type/proposal.type';
// import QuillViewer from 'components/proposal/quillViewer';
// import { initQuill } from 'utils/quillUtil';
// initQuill();
// import useLoadQuill from 'hooks/useLoadQuill';

export default function Proposal() {
  const router = useRouter();
  // const enableQuill = useLoadQuill();
  const [data, setData] = useState<IBaseProposal>();

  const getProposalInfo = async () => {
    const id = Number(router.query.id);
    if (!id) {
      return;
    }
    const res = await requests.proposal.getProposalDetail(id);
    setData(res.data.thread);
  };

  useEffect(() => {
    getProposalInfo();
  }, [router.query.id]);

  return (
    <Layout title="SeeDAO Proposal">
      <ProposalContainer>
        <ProposalTitle>{data?.title}</ProposalTitle>
        <User>
          <div className="left">
            <UserAvatar src={data?.user.photo_url} alt="" />
          </div>
          <div className="right">
            <div className="name">{data?.user.username}</div>
            <div className="date">{data?.updated_at}</div>
          </div>
        </User>
        <div>{data?.first_post.content}</div>
        {/* {enableQuill && data?.first_post.content &&  <QuillViewer content={data?.first_post.content} />} */}
      </ProposalContainer>
    </Layout>
  );
}

const ProposalContainer = styled.div``;

const ProposalTitle = styled.div``;
const User = styled.div`
  display: flex;
  gap: 10px;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
