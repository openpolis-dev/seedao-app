import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatTime } from 'utils/time';
import { ISimpleProposal } from 'type/proposalV2.type';
import ProposalStateTag, { getRealState } from './stateTag';
import DefaultAvatarIcon from 'assets/Imgs/defaultAvatar.png';
import CategoryTag from './categoryTag';
import { getProposalSIPSlug } from 'utils';
import { useTranslation } from "react-i18next";

export enum TabType {
  All = 1,
  History,
  My,
  Submitted,
  UnSubmitted,
}

export default function SimpleProposalItem({
  data,
  isReview,
  sns,
  currentTab,
}: {
  sns: string;
  data: ISimpleProposal;
  isReview?: boolean;
  currentTab: TabType[];
}) {
  const currentState = getRealState(data.state);
  const { t } = useTranslation();
  return (
    <CardBox key={data.id}>
      <Link to={`/proposal/thread/${data.id}${isReview ? '?review' : ''}`} state={{
        currentTab,
        data,
      }}>
        <CardHeaderStyled>
          <Title>
            {getProposalSIPSlug(data.sip)}
            {data.title}
          </Title>
        </CardHeaderStyled>
        <CardBody>
          <AvaBox>
            <div className="left">
              <UserAvatar src={data.applicant_avatar || DefaultAvatarIcon} alt="" />
            </div>
            <div className="right">
              <div className="name">{sns}</div>
              <div className="date">{formatTime(data.create_ts * 1000)}</div>
            </div>
          </AvaBox>
          <TagsBox>
            <CategoryTag>{data.category_name}</CategoryTag>
            <ProposalStateTag state={currentState} />
            <VotedBox>{t('Proposal.HasVote')}</VotedBox>
          </TagsBox>
        </CardBody>
      </Link>
    </CardBox>
  );
}

const CardBody = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 16px;
`;

const CardBox = styled.div`
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  cursor: pointer;
  background: var(--bs-box-background);
  padding: 16px 24px;
  border-radius: 16px;
  margin-bottom: 16px;

  .name {
    font-size: 16px;
    color: var(--bs-body-color_active);
    line-height: 1em;
  }

  .date {
    font-size: 12px;
    color: var(--bs-body-color);
  }
`;

const CardHeaderStyled = styled.div`
  display: flex;
  gap: 10px;
`;

const AvaBox = styled.div`
  display: flex;
  align-items: center;
  .left {
    margin-right: 10px;
  }

  .right {
    .name {
      font-size: 14px;
    }
    .date {
      line-height: 18px;
      margin-top: 4px;
    }
  }
`;

const UserAvatar = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  font-family: Poppins-SemiBold, Poppins;
  color: var(--bs-body-color_active);
`;

const TagsBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const VotedBox = styled.div`
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #08D0EA30;
    color: #08b0c5;
    font-size: 12px;
    background: #08D0EA30;
    padding: 0 16px;
    line-height: 24px;
    text-align: center;
`
