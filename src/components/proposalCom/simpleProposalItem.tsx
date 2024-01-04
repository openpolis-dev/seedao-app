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

  const currentState = getRealState(data.state);
  return (
    <CardBox key={data.id}>
      <div onClick={openProposal}>
        <CardHeaderStyled>
          <Title>{data.title}</Title>
        </CardHeaderStyled>
        <CardBody>
          <FlexLine>
            <AvaBox>
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
            </AvaBox>
            <div>
              <CatBox>{data.category_name}</CatBox>
              <ProposalStateTag state={currentState} />
            </div>
          </FlexLine>
        </CardBody>
      </div>
    </CardBox>
  );
}

const FlexLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;

const CardBox = styled.div`
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  cursor: pointer;
  background: var(--bs-box-background);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;

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
  font-family: Poppins-SemiBold, Poppins;
  color: var(--bs-body-color_active);
`;

const CatBox = styled.div`
  display: inline-block;
  border-radius: 4px;
  border: 1px solid var(--bs-border-color_opacity);
  margin-right: 10px;
  color: var(--bs-body-color_active);
  font-size: 12px;
  padding: 0 16px;
  line-height: 2em;
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
