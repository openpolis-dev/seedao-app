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
      color = 'green';
      text = t('Proposal.Approve');
      break;
    case ProposalState.Rejected:
      color = 'red';
      text = t('Proposal.Rejected');
      break;
    case ProposalState.Draft:
      color = 'yellow';
      text = t('Proposal.Draft');
      break;
    case ProposalState.PendingSubmit:
      color = 'yellow';
      text = t('Proposal.PendingCommit');
      break;
    case ProposalState.VotingPassed:
      color = '#ddd';
      text = t('Proposal.Passed');
      break;
    case ProposalState.VotingFailed:
      color = '#ddd';
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
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
`;
