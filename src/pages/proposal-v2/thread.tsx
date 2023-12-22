import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useParams } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import ProposalVote from 'components/proposalCom/vote';
import ReplyComponent from 'components/proposalCom/reply';
import ReviewProposalComponent from 'components/proposalCom/reviewProposalComponent';
import EditActionHistory from 'components/proposalCom/editActionhistory';

enum BlockContentType {
  Reply = 1,
  History,
}

interface IProps {}

export default function ThreadPage() {
  const [search] = useSearchParams();
  const review = search.get('review') === '';
  const { id } = useParams();
  const { t } = useTranslation();

  const [blockType, setBlockType] = useState<BlockContentType>(BlockContentType.Reply);

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
      <ReplyAndHistoryBlock>
        <BlockTab>
          <li
            className={blockType === BlockContentType.Reply ? 'selected' : ''}
            onClick={() => setBlockType(BlockContentType.Reply)}
          >
            {`10 `}
            {t('Proposal.Comment')}
          </li>
          <li
            className={blockType === BlockContentType.History ? 'selected' : ''}
            onClick={() => setBlockType(BlockContentType.History)}
          >
            {t('Proposal.EditHistory')}
          </li>
        </BlockTab>
        {blockType === BlockContentType.Reply && <ReplyComponent hideReply={review} />}
        {blockType === BlockContentType.History && <EditActionHistory />}
      </ReplyAndHistoryBlock>
      {review && <ReviewProposalComponent onUpdateStatus={onUpdateStatus} />}
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
`;

const ReplyAndHistoryBlock = styled.div``;

const BlockTab = styled.ul`
  display: flex;
  font-size: 20px;
  gap: 40px;
  margin-bottom: 16px;
  li {
    cursor: pointer;
  }
  li.selected {
    color: var(--bs-primary);
  }
`;
