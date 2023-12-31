import { useMemo } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from 'utils/time';
import { useAuthContext } from 'providers/authProvider';
import { ISimpleProposal } from 'type/proposalV2.type';
import ProposalStateTag, { getRealState } from './stateTag';
import DefaultAvatarIcon from 'assets/Imgs/defaultAvatar.png';

const CardBody = styled.div``;

export default function SimpleProposalItem({
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

  const openProposal = () => {
    navigate(`/proposal-v2/thread/${data.id}${isReview ? '?review' : ''}`, { state: data });
  };

  const borderStyle = useMemo(() => {
    return theme ? 'unset' : 'none';
  }, [theme]);
  const currentState = getRealState(data.state);
  return (
    <CardBox key={data.id} border={borderStyle}>
      <div onClick={openProposal}>
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
        <CardBody>
          <Title>{data.title}</Title>
          <div>
            <span>{data.category_name}</span>
            <ProposalStateTag state={currentState} />
          </div>
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
