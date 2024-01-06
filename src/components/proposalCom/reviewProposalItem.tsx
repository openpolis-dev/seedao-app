import { useMemo } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from 'utils/time';
import { useAuthContext } from 'providers/authProvider';
import { ISimpleProposal } from 'type/proposalV2.type';
import ProposalStateTag, { getRealState } from './stateTag';
import DefaultAvatarIcon from 'assets/Imgs/defaultAvatar.png';
import RhtArrow from 'assets/Imgs/proposal/rightArrow.svg';
import { useTranslation } from 'react-i18next';
import useMetaforoLogin from 'hooks/useMetaforoLogin';

const CardBody = styled.div``;

export default function ReviewProposalItem({
  data,
  isReview,
  sns,
}: {
  sns: string;
  data: ISimpleProposal;
  isReview?: boolean;
}) {
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
        <div>
          <CardBody>
            <Title>{data.title}</Title>
            <Line>
              <ProposalStateTag state={currentState} />
              <CatBox>{data.category_name}</CatBox>
            </Line>
          </CardBody>
          <CardHeaderStyled>
            <div className="left">
              <UserAvatar src={data.applicant_avatar || DefaultAvatarIcon} alt="" />
            </div>
            <div className="right">
              <div className="name">
                <span>{sns}</span>
              </div>
              <div className="date">
                {/* <Link to={`/proposal/category/${data.category_index_id}`}>#{data.category_name}</Link> */}
                <span>{formatDate(new Date(data.create_ts * 1000))}</span>
              </div>
            </div>
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
  margin-right: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
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

const CatBox = styled.div`
  display: inline-block;
  border-radius: 4px;
  border: 1px solid var(--bs-border-color_opacity);
  margin-left: 10px;
  color: var(--bs-body-color_active);
  font-size: 12px;
  padding: 0 16px;
  line-height: 2em;
`;

const Line = styled.div`
  margin-bottom: 26px;
`;
