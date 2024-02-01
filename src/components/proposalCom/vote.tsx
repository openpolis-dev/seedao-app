import { useEffect, useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Poll, VoteOptionType, VoteType, VoteOption, VoteGateType, ProposalState } from 'type/proposalV2.type';
import { castVote, checkCanVote, closeVote } from 'requests/proposalV2';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import useCheckMetaforoLogin from 'hooks/useMetaforoLogin';
import VoterListModal from 'components/modals/voterListModal';
import ConfirmModal from 'components/modals/confirmModal';
import { formatDeltaDate } from 'utils/time';
import usePermission from 'hooks/usePermission';
import { PermissionAction, PermissionObject } from 'utils/constant';

const { Check } = Form;

interface IProps {
  proposalState: ProposalState;
  id: number;
  poll: Poll;
  voteGate?: VoteGateType;
  isOverrideProposal?: boolean;
  execution_ts?: number;
  voteOptionType: VoteOptionType;
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

export default function ProposalVote({
  execution_ts,
  proposalState,
  id,
  poll,
  voteGate,
  isOverrideProposal,
  voteOptionType,
  updateStatus,
}: IProps) {
  const { t } = useTranslation();
  const [selectOption, setSelectOption] = useState<VoteOption>();
  const [openVoteItem, setOpenVoteItem] = useState<VoteOptionItem>();
  const [showConfirmVote, setShowConfirmVote] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);

  const { dispatch } = useAuthContext();
  const { showToast } = useToast();

  const { checkMetaforoLogin } = useCheckMetaforoLogin();
  const canUseCityhall = usePermission(PermissionAction.AuditApplication, PermissionObject.ProjectAndGuild);

  const pollStatus = getPollStatus(poll.poll_start_at, poll.close_at);
  const renderExecutionTip = (props: any) => (
    <Tooltip {...props}>
      <Tip>{t('Proposal.ExecutionTip')}</Tip>
    </Tooltip>
  );

  const onlyShowVoteOption =
    voteOptionType === 99 &&
    [ProposalState.Rejected, ProposalState.Withdrawn, ProposalState.PendingSubmit, ProposalState.Draft].includes(
      proposalState,
    );

  const voteStatusTag = useMemo(() => {
    if (onlyShowVoteOption) {
      return <OpenTag>{t('Proposal.VoteNotStart')}</OpenTag>;
    }
    if (proposalState === ProposalState.Executed) {
      return <CloseTag>{t('Proposal.VoteClose')}</CloseTag>;
    } else if (hasClosed || proposalState === ProposalState.PendingExecution) {
      return (
        <>
          <OpenTag>
            {t('Proposal.AutoExecuteLeftTime', {
              ...formatDeltaDate(execution_ts ? execution_ts * 1000 : new Date(poll.close_at).getTime() + 86400000),
            })}
          </OpenTag>
          <OverlayTrigger overlay={renderExecutionTip} placement="right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              fill="none"
              viewBox="0 0 24 24"
              style={{ marginLeft: '4px' }}
            >
              <path
                stroke="var(--bs-border-color)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10a3 3 0 1 1 3 3v1m9-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
              />
              <circle cx={12} cy={17} r={1} fill="var(--bs-border-color)" />
            </svg>
          </OverlayTrigger>
        </>
      );
    } else if (pollStatus === VoteType.Closed) {
      return <CloseTag>{t('Proposal.VoteClose')}</CloseTag>;
    } else if (pollStatus === VoteType.Open) {
      return (
        <>
          <OpenTag>
            {t('Proposal.VoteEndAt', {
              leftTime: t('Proposal.TimeDisplay', { ...formatDeltaDate(new Date(poll.close_at).getTime()) }),
            })}
          </OpenTag>
          {isOverrideProposal && canUseCityhall && (
            <CloseButton onClick={() => setShowConfirmClose(true)}>{t('Proposal.CloseVote')}</CloseButton>
          )}
        </>
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
  }, [pollStatus, t, canUseCityhall, hasClosed, execution_ts, onlyShowVoteOption]);

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

  const onConfirmClose = () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    closeVote(id, poll.id)
      .then((r) => {
        setShowConfirmClose(false);
        setHasClosed(true);
      })
      .catch((error) => {
        logError(`close vote(${id}-${poll.id}) failed`, error);
        showToast(`close vote failed: ${error?.data?.msg || error?.code || error}`, ToastType.Danger);
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
    if (!onlyShowVoteOption && pollStatus === VoteType.Open && !poll.is_vote) {
      getVotePermission();
    }
  }, [poll, pollStatus, onlyShowVoteOption]);

  const showVoteContent = () => {
    if (
      !onlyShowVoteOption &&
      ((pollStatus === VoteType.Open && !!poll.is_vote) || pollStatus === VoteType.Closed || hasClosed)
    ) {
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
        {showConfirmClose && (
          <ConfirmModal
            msg={t('Proposal.ConfirmToCloseVote')}
            onConfirm={onConfirmClose}
            onClose={() => setShowConfirmClose(false)}
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

const CloseButton = styled(Button)`
  height: 32px;
  margin-left: 10px;
`;

const Tip = styled.div`
  width: 300px;
  font-size: 14px;
  background-color: var(--bs-box--background);
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  color: var(--bs-body-color_active);
  padding: 8px;
  border: 1px solid var(--bs-border-color);
`;
