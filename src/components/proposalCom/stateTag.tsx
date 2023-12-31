import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ProposalState } from 'type/proposalV2.type';

export const getRealState = (state?: ProposalState): ProposalState | undefined => {
  if (state === ProposalState.Approved) {
    // TODO check vote status
    return state;
  } else if (state) {
    return state;
  }
};

export default function ProposalStateTag({ state }: { state?: ProposalState }) {
  const { t } = useTranslation();
  let color: string;
  let text: string;
  switch (state) {
    case ProposalState.Approved:
      color = '#1F9E14';
      text = t('Proposal.Approve');
      break;
    case ProposalState.Rejected:
      color = '#FB4E4E';
      text = t('Proposal.Rejected');
      break;
    case ProposalState.Draft:
      color = '#2F8FFF';
      text = t('Proposal.Draft');
      break;
    case ProposalState.PendingSubmit:
      color = '#F9B617';
      text = t('Proposal.PendingCommit');
      break;
    case ProposalState.Withdrawn:
      color = '#B0B0B0';
      text = t('Proposal.Withdrawn');
      break;
    case ProposalState.VotingPassed:
      color = '#1F9E14';
      text = t('Proposal.Passed');
      break;
    case ProposalState.VotingFailed:
      color = '#FB4E4E';
      text = t('Proposal.Failed');
      break;
    default:
      text = '';
      color = '#ddd';
  }
  return <StatusTag $color={color}>{text}</StatusTag>;
}

const StatusTag = styled.div<{ $color: string }>`
  background-color: ${(props) => props.$color};
  padding: 2px 10px;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  line-height: 2em;
  font-weight: 500;
  display: inline-block;
`;
