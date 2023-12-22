import styled from 'styled-components';
import { useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import ProposalVote from 'components/proposalCom/vote';
import ReplyComponent from 'components/proposalCom/reply';
import ReviewProposalComponent from 'components/proposalCom/reviewProposalComponent';

interface IProps {}

export default function ThreadPage() {
  const [search] = useSearchParams();
  const review = search.get('review') === '';
  const { id } = useParams();

  useEffect(() => {
    const getProposalDetail = () => {};
    getProposalDetail();
  }, [id]);

  const onUpdateStatus = (status: string) => {
    // TODO
  };

  return (
    <Page>
      {/* <ProposalVote /> */}
      <ReplyComponent hideReply={review} />
      {review && <ReviewProposalComponent onUpdateStatus={onUpdateStatus} />}
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
`;
