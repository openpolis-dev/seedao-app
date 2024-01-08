import { useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { formatTime } from 'utils/time';
import { useAuthContext } from 'providers/authProvider';
import { ISimpleProposal } from 'type/proposalV2.type';
import ProposalStateTag, { getRealState } from './stateTag';
import DefaultAvatarIcon from 'assets/Imgs/defaultAvatar.png';
import RhtArrow from 'assets/Imgs/proposal/rightArrow.svg';
import { useTranslation } from 'react-i18next';
import useMetaforoLogin from 'hooks/useMetaforoLogin';
import CategoryTag from './categoryTag';

export default function ReviewProposalItem({ data, sns }: { sns: string; data: ISimpleProposal; isReview?: boolean }) {
  const navigate = useNavigate();
  const {
    state: { theme },
  } = useAuthContext();
  const { t } = useTranslation();
  const { checkMetaforoLogin } = useMetaforoLogin();
  const openProposal = async () => {
    const canReview = await checkMetaforoLogin();
    if (canReview) {
      navigate(`/city-hall/governance/review-proposal/${data.id}`, { state: data });
    }
  };

  const borderStyle = useMemo(() => {
    return theme ? 'unset' : 'none';
  }, [theme]);
  const currentState = getRealState(data.state);
  return (
    <CardBox key={data.id} border={borderStyle}>
      <FlexLine onClick={openProposal}>
        <div style={{ flex: 1 }}>
          <Title>{data.title}</Title>
          <CardHeaderStyled>
            <LeftBox>
              <div className="left">
                <UserAvatar src={data.applicant_avatar || DefaultAvatarIcon} alt="" />
              </div>
              <div className="right">
                <div className="name">
                  <span>{sns}</span>
                </div>
                <div className="date">
                  <span>{formatTime(data.create_ts * 1000)}</span>
                </div>
              </div>
            </LeftBox>
            <Line>
              <CategoryTag>{data.category_name}</CategoryTag>
              <ProposalStateTag state={currentState} />
            </Line>
          </CardHeaderStyled>
        </div>
        {currentState === 'draft' && (
          <AuditBox>
            <span>{t('Proposal.Audit')}</span>
            <img src={RhtArrow} alt="" />
          </AuditBox>
        )}
      </FlexLine>
    </CardBox>
  );
}

const FlexLine = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
`;

const AuditBox = styled.div`
  color: #8857c8;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid var(--bs-border-color);
  width: 250px;
  flex-shrink: 0;
  cursor: pointer;
  img {
    margin-left: 27px;
  }
`;

const CardBox = styled.div<{ border: string }>`
  border: ${(props) => props.border};
  cursor: pointer;
  background: var(--bs-box-background);
  padding: 16px 0 16px 24px;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: var(--box-shadow);
`;

const CardHeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  .name {
    font-size: 14px;
    font-family: Poppins-SemiBold;
    color: var(--bs-body-color_active);
    font-weight: bold;
  }
  .date {
    font-size: 12px;
    color: var(--bs-body-color);
    padding-inline: 2px;
    margin-left: 32px;
  }
  .right {
    display: flex;
    align-items: center;
  }
`;

const LeftBox = styled.div`
  display: flex;
  gap: 10px;
`;

const UserAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  font-family: Poppins-SemiBold;
  color: var(--bs-body-color_active);
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;

const Line = styled.div`
  margin-right: 24px;
  display: flex;
  gap: 12px;
  align-items: self-end;
`;
