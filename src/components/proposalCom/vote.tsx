import { useEffect, useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Poll, VoteType, VoteOption, VoteGateType, ProposalState } from 'type/proposalV2.type';
import { castVote, checkCanVote } from 'requests/proposalV2';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import useCheckMetaforoLogin from 'hooks/useMetaforoLogin';
import VoterListModal from 'components/modals/voterListModal';
import ConfirmModal from 'components/modals/confirmModal';
import { formatDeltaDate } from 'utils/time';
const { Check } = Form;

interface IProps {
  proposalState: ProposalState;
  id: number;
  poll: Poll;
  voteGate?: VoteGateType;
  updateStatus: () => void;
}

type VoteOptionItem = {
  count: number;
  optionId: number;
};

const getPollStatus = (start_t: string, close_t: string) => {
  const start_at = new Date(start_t).getTime();
  const close_at = new Date(close_t).getTime();
  if (start_at > Date.now()) {
    return VoteType.Waite;
  }
  if (close_at <= Date.now()) {
    return VoteType.Closed;
  }
  return VoteType.Open;
};

export default function ProposalVote({ proposalState, id, poll, voteGate, updateStatus }: IProps) {
  const { t } = useTranslation();
  const [selectOption, setSelectOption] = useState<VoteOption>();
  const [openVoteItem, setOpenVoteItem] = useState<VoteOptionItem>();
  const [showConfirmVote, setShowConfirmVote] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const { dispatch } = useAuthContext();
  const { showToast } = useToast();

  const { checkMetaforoLogin } = useCheckMetaforoLogin();

  const pollStatus = getPollStatus(poll.poll_start_at, poll.close_at);

  const voteStatusTag = useMemo(() => {
    if (proposalState === ProposalState.Executed) {
      return <CloseTag>{t('Proposal.VoteClose')}</CloseTag>;
    } else if (proposalState === ProposalState.PendingExecution) {
      return (
        <OpenTag>
          {t('Proposal.AutoExecuteLeftTime', { ...formatDeltaDate(new Date(poll.close_at).getTime() + 86400000) })}
        </OpenTag>
      );
    } else if (pollStatus === VoteType.Closed) {
      return <CloseTag>{t('Proposal.VoteClose')}</CloseTag>;
    } else if (pollStatus === VoteType.Open) {
      return (
        <OpenTag>
          {t('Proposal.VoteEndAt', {
            leftTime: t('Proposal.TimeDisplay', { ...formatDeltaDate(new Date(poll.close_at).getTime()) }),
          })}
        </OpenTag>
      );
    } else {
      return (
        <OpenTag>
          {t('Proposal.VoteStartAt', {
            leftTime: t('Proposal.TimeDisplay', { ...formatDeltaDate(new Date(poll.poll_start_at).getTime()) }),
          })}
        </OpenTag>
      );
    }
  }, [pollStatus, t]);

  const onConfirmVote = () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    castVote(id, poll.id, selectOption?.id!)
      .then(() => {
        setShowConfirmVote(false);
        updateStatus();
        showToast(t('Msg.CastVoteSuccess'), ToastType.Success);
      })
      .catch((error) => {
        logError('cast error failed', error);
        showToast(`cast error failed: ${error?.data?.msg || error?.code || error}`, ToastType.Danger);
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
  };

  const goVote = async (option: VoteOption) => {
    const canVote = await checkMetaforoLogin();
    if (!canVote) {
      return;
    }
    setShowConfirmVote(true);
  };

  useEffect(() => {
    const getVotePermission = () => {
      checkCanVote(id).then((r) => {
        setHasPermission(r.data);
      });
    };
    if (pollStatus === VoteType.Open && !poll.is_vote) {
      getVotePermission();
    }
  }, [poll, pollStatus]);

  const showVoteContent = () => {
    if ((pollStatus === VoteType.Open && !!poll.is_vote) || pollStatus === VoteType.Closed) {
      return (
        <table>
          <tbody>
            {poll.options.map((option, index) => (
              <tr>
                <td>
                  <OptionContent $highlight={option.is_vote}>
                    {option.html}
                    {!!option.is_vote && <HasVote>({t('Proposal.HasVote')})</HasVote>}
                  </OptionContent>
                </td>
                <td>
                  <ProgressBar percent={option.percent}>
                    <div className="inner"></div>
                  </ProgressBar>
                </td>
                <td>
                  <VoteNumber
                    onClick={() => !!option.voters && setOpenVoteItem({ count: option.voters, optionId: option.id })}
                  >
                    <span className={!!option.is_vote ? 'active' : ''}>{option.voters}</span>
                    <span className="voters"> ({option.percent}%)</span>
                  </VoteNumber>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <>
          {poll.options.map((option, index) => (
            <VoteOptionSelect key={index}>
              <Check
                type="radio"
                checked={selectOption?.id === option.id}
                onChange={(e) => setSelectOption(e.target.checked ? option : undefined)}
                disabled={!hasPermission}
              />
              <OptionContentPure>{option.html}</OptionContentPure>
            </VoteOptionSelect>
          ))}
          {hasPermission && (
            <VoteButton onClick={goVote} disabled={selectOption === void 0}>
              {t('Proposal.Vote')}
            </VoteButton>
          )}
        </>
      );
    }
  };

  return (
    <CardStyle id="vote-block">
      <div className="innerBox">
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

          {voteGate && (
            <VoteNFT>
              <span>
                {t('Proposal.PollNFT')}: {voteGate.contract_addr}
              </span>
              <span>Token Id: {voteGate.token_id}</span>
              {voteGate.name && <span>{voteGate.name}</span>}
            </VoteNFT>
          )}
        </VoteBody>
        {!!openVoteItem && <VoterListModal {...openVoteItem} onClose={() => setOpenVoteItem(undefined)} />}
        {showConfirmVote && (
          <ConfirmModal
            msg={t('Proposal.ConfirmVoteOption', { option: selectOption?.html })}
            onConfirm={onConfirmVote}
            onClose={() => setShowConfirmVote(false)}
          />
        )}
      </div>
    </CardStyle>
  );
}
const FlexLine = styled.div``;

const CardStyle = styled.div`
  margin-bottom: 32px;
  display: flex;
  .innerBox {
    min-width: 500px;
  }
`;

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

const VoteBody = styled.div`
  border-bottom: 1px solid var(--bs-border-color);
  padding-bottom: 16px;
`;

const VoteNFT = styled.div`
  color: var(--bs-body-color);
  margin-top: 16px;
  margin-bottom: 14px;
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
  display: flex;
  align-items: center;
`;

const VoteOptionSelect = styled(VoteOptionBlock)`
  display: flex;
  align-items: center;
  gap: 8px;
  input:disabled {
    background-color: #d9d9d980;
    border-color: rgba(217, 217, 217, 0.5);
  }
`;

const ProgressBar = styled.div<{ percent: number }>`
  width: 500px;
  height: 10px;
  border-radius: 16px;
  box-sizing: border-box;
  background: rgba(82, 0, 255, 0.1);
  overflow: hidden;
  margin-right: 16px;
  margin-bottom: 16px;
  .inner {
    width: ${(props) => props.percent}%;
    background-color: var(--bs-primary);
    height: 10px;
  }
`;

const VoteNumber = styled.div`
  margin-bottom: 16px;
  color: var(--bs-body-color_active);
  .voters {
    color: var(--bs-primary);
    cursor: pointer;
  }
  .active {
    color: var(--bs-primary);
  }
`;

const OptionContentPure = styled.div`
  font-size: 14px;
  color: var(--bs-body-color_active);
`;

const OptionContent = styled.div<{ $highlight?: number }>`
  font-size: 14px;
  color: ${({ $highlight }) => ($highlight ? 'var(--bs-primary)' : 'var(--bs-body-color_active)')};
  margin-right: 20px;
  line-height: 20px;
  margin-bottom: 16px;
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
