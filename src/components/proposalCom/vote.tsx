import { useMemo, useState } from 'react';
import { Button, Form, Toast } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Poll, VoteType } from 'type/proposalV2.type';
import { castVote } from 'requests/proposalV2';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import useCheckMetaforoLogin from 'hooks/useCheckMetaforoLogin';
const { Check } = Form;

interface IProps {
  id: number;
  poll: Poll;
  updateStatus: () => void;
}

export default function ProposalVote({ id, poll, updateStatus }: IProps) {
  const { t } = useTranslation();
  const [selectOption, setSelectOption] = useState<number>();
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();

  const checkMetofoLogin = useCheckMetaforoLogin();

  const voteStatusTag = useMemo(() => {
    console.log('poll.vote_type', poll.status);
    if (poll.status === VoteType.Closed) {
      return <CloseTag>{t('Proposal.VoteClose')}</CloseTag>;
    } else if (poll.status === VoteType.Open) {
      return <OpenTag>{t('Proposal.VoteEndAt', { leftTime: poll.leftTime })}</OpenTag>;
    } else {
      return <></>;
    }
  }, [poll, t]);

  const goVote = async () => {
    const canVote = await checkMetofoLogin();
    if (!canVote) {
      return;
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    castVote(id, poll.id, selectOption!)
      .then(() => {
        updateStatus();
      })
      .catch((error) => {
        logError('cast error failed', error);
        showToast(`cast error failed: ${error?.data?.msg}`, ToastType.Danger);
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
  };

  const showVoteContent = () => {
    if (poll.status === VoteType.Open || poll.status === VoteType.Closed || poll.is_vote) {
      return poll.options.map((option, index) => (
        <VoteOption key={index}>
          <OptionContent>{option.html}</OptionContent>
          <VoteOptionBottom>
            <ProgressBar percent={option.percent}>
              <div className="inner"></div>
            </ProgressBar>
            <span>{option.percent}%</span>
            <span className="voters">({option.voters})</span>
          </VoteOptionBottom>
        </VoteOption>
      ));
    } else {
      return (
        <>
          {poll.options.map((option, index) => (
            <VoteOptionSelect key={index}>
              <Check
                type="radio"
                checked={selectOption === option.id}
                onChange={(e) => setSelectOption(e.target.checked ? option.id : undefined)}
              />
              <OptionContent>{option.html}</OptionContent>
            </VoteOptionSelect>
          ))}
          <VoteButton onClick={goVote} disabled={selectOption === void undefined}>
            {t('Proposal.Vote')}
          </VoteButton>
        </>
      );
    }
  };

  return (
    <CardStyle>
      <VoteHead>
        <VoteHeadLeft>{poll.title}</VoteHeadLeft>
        {poll.arweave && (
          <ExportButton href={`https://arweave.net/tx/${poll.arweave}/data.csv`}>{t('Proposal.Export')}</ExportButton>
        )}
      </VoteHead>
      <VoteBody>
        <TotalVoters>
          <span>
            {t('Proposal.TotalVotes')}: {poll.totalVotes}
          </span>
          <span className="dot">·</span>
          {voteStatusTag}
        </TotalVoters>
        {showVoteContent()}
      </VoteBody>
      <VoteFooter>
        <VoteNFT>
          <span>
            {t('Proposal.PollNFT')}: {poll.address}
          </span>
          {poll.token_id && <span>Token Id: {poll.token_id}</span>}
        </VoteNFT>
        {poll.alias && <Alias>{poll.alias}</Alias>}
      </VoteFooter>
    </CardStyle>
  );
}

const CardStyle = styled.div`
  font-size: 14px;
  color: var(--bs-body-color_active);
  border-radius: 16px;
  background-color: var(--bs-box--background);
  border: 1px solid var(--bs-border-color);
`;

const VoteHead = styled.div`
  display: flex;
  justify-content: space-between;
  height: 40px;
  line-height: 40px;
  padding-inline: 20px;
`;

const VoteHeadLeft = styled.div``;

const ExportButton = styled.a`
  color: var(--bs-primary);
  font-family: Poppins-SemiBold, Poppins;
`;

const VoteBody = styled.div`
  padding-inline: 20px;
  border-top: 1px solid var(--bs-border-color);
  border-bottom: 1px solid var(--bs-border-color);
  padding-bottom: 14px;
`;
const VoteFooter = styled.div`
  padding-inline: 20px;
  display: flex;
  justify-content: space-between;
  line-height: 36px;
`;

const VoteNFT = styled.div`
  color: var(--bs-body-color);
  span {
    margin-right: 20px;
  }
`;

const TotalVoters = styled.div`
  margin-top: 14px;
  margin-bottom: 9px;
  .dot {
    margin-inline: 4px;
  }
`;

const CloseTag = styled.span`
  color: red;
`;
const OpenTag = styled.span`
  color: var(--bs-body-color);
`;

const VoteOption = styled.div`
  margin-top: 12px;
`;

const VoteOptionSelect = styled(VoteOption)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBar = styled.div<{ percent: number }>`
  width: 400px;
  height: 8px;
  border-radius: 16px;
  box-sizing: border-box;
  background-color: var(--bs-body-color);
  overflow: hidden;
  .inner {
    width: ${(props) => props.percent}%;
    background-color: var(--bs-primary);
    height: 8px;
  }
`;

const VoteOptionBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  .voters {
    color: var(--bs-primary);
  }
`;

const OptionContent = styled.div`
  font-size: 16px;
`;

const Alias = styled.div`
  color: var(--bs-primary);
`;

const VoteButton = styled(Button)`
  margin-top: 16px;
`;
