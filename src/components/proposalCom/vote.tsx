import { useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Poll, VoteType, VoteOption } from 'type/proposalV2.type';
import { castVote } from 'requests/proposalV2';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import useCheckMetaforoLogin from 'hooks/useCheckMetaforoLogin';
import VoterListModal from 'components/modals/voterListModal';
import ConfirmModal from 'components/modals/confirmModal';
const { Check } = Form;

interface IProps {
  id: number;
  poll: Poll;
  updateStatus: () => void;
}

type VoteOptionItem = {
  count: number;
  optionId: number;
};

export default function ProposalVote({ id, poll, updateStatus }: IProps) {
  const { t } = useTranslation();
  const [selectOption, setSelectOption] = useState<VoteOption>();
  const [openVoteItem, setOpenVoteItem] = useState<VoteOptionItem>();
  const [showConfirmVote, setShowConfirmVote] = useState(false);

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

  const onConfirmVote = () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    castVote(id, poll.id, selectOption?.id!)
      .then(() => {
        setShowConfirmVote(false);
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

  const goVote = async (option: VoteOption) => {
    const canVote = await checkMetofoLogin();
    if (!canVote) {
      return;
    }
    setShowConfirmVote(true);
  };

  const showVoteContent = () => {
    if ((poll.status === VoteType.Open && !!poll.is_vote) || poll.status === VoteType.Closed) {
      return poll.options.map((option, index) => (
        <VoteOptionBlock key={index}>
          <OptionContent $highlight={option.is_vote}>
            {option.html}
            {!!option.is_vote && <HasVote>({t('Proposal.HasVote')})</HasVote>}
          </OptionContent>
          <VoteOptionBottom>
            <ProgressBar percent={option.percent}>
              <div className="inner"></div>
            </ProgressBar>
            <div onClick={() => !!option.voters && setOpenVoteItem({ count: option.voters, optionId: option.id })}>
              <span>{option.voters}</span>
              <span className="voters"> ({option.percent}%)</span>
            </div>
          </VoteOptionBottom>
        </VoteOptionBlock>
      ));
    } else {
      return (
        <>
          {poll.options.map((option, index) => (
            <VoteOptionSelect key={index}>
              <Check
                type="radio"
                checked={selectOption?.id === option.id}
                onChange={(e) => setSelectOption(e.target.checked ? option : undefined)}
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
        <span>
          {' '}
          {t('Proposal.TotalVotes')}: {poll.totalVotes}
        </span>
        <TotalVoters>
          {/*<span>*/}
          {/*  {t('Proposal.TotalVotes')}: {poll.totalVotes}*/}
          {/*</span>*/}
          {voteStatusTag}
        </TotalVoters>
      </VoteHead>
      <FlexLine>
        <VoteHeadLeft>{poll.title}</VoteHeadLeft>
        {/* {poll.arweave && (
          <ExportButton href={`https://arweave.net/tx/${poll.arweave}/data.csv`}>{t('Proposal.Export')}</ExportButton>
        )} */}
      </FlexLine>
      <VoteBody>
        {showVoteContent()}

        {poll.address && (
          <VoteNFT>
            <span>
              {t('Proposal.PollNFT')}: {poll.address}
            </span>
            <span>Token Id: {poll.token_id}</span>
          </VoteNFT>
        )}
      </VoteBody>
      <VoteFooter>{poll.alias && <Alias>{poll.alias}</Alias>}</VoteFooter>
      {!!openVoteItem && <VoterListModal {...openVoteItem} onClose={() => setOpenVoteItem(undefined)} />}
      {showConfirmVote && (
        <ConfirmModal
          msg={t('Proposal.ConfirmVoteOption', { option: selectOption?.html })}
          onConfirm={onConfirmVote}
          onClose={() => setShowConfirmVote(false)}
        />
      )}
    </CardStyle>
  );
}
const FlexLine = styled.div``;

const CardStyle = styled.div``;

const VoteHead = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--bs-body-color_active);
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 24px;
`;

const VoteHeadLeft = styled.div``;

const ExportButton = styled.a`
  color: var(--bs-primary);
  font-family: Poppins-SemiBold, Poppins;
`;

const VoteBody = styled.div`
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
  margin-top: 16px;
  span {
    margin-right: 20px;
  }
`;

const TotalVoters = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
`;

const CloseTag = styled.span`
  color: red;
`;
const OpenTag = styled.span`
  color: var(--bs-primary);
`;

const VoteOptionBlock = styled.div`
  margin-top: 12px;
`;

const VoteOptionSelect = styled(VoteOptionBlock)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBar = styled.div<{ percent: number }>`
  width: 500px;
  height: 8px;
  border-radius: 16px;
  box-sizing: border-box;
  background: rgba(82, 0, 255, 0.1);
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
  color: var(--bs-body-color_active);
  .voters {
    color: var(--bs-primary);
    cursor: pointer;
  }
`;

const OptionContent = styled.div<{ $highlight?: number }>`
  font-size: 14px;
  color: ${({ $highlight }) => ($highlight ? 'var(--bs-primary)' : 'var(--bs-body-color_active)')};
  margin-top: 0.25em;
`;

const Alias = styled.div`
  color: var(--bs-primary);
`;

const VoteButton = styled(Button)`
  margin-top: 16px;
  border-radius: 8px;
  color: var(--bs-body-color_active);
  border: 1px solid var(--proposal-border);
  background: var(--profile-bg);
  min-width: 120px;
`;

const HasVote = styled.span`
  color: var(--bs-primary);
`;
