import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import { ProposalStatus, PROPOSAL_TYPES, PROPOSAL_TIME } from 'type/proposal.type';
import SeeSelect from 'components/common/select';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function ProposalIndexPage() {
  const { t } = useTranslation();
  // filter types
  const TYPE_OPTIONS: ISelectItem[] = PROPOSAL_TYPES.map((tp) => ({
    value: tp.id,
    label: t(tp.name as any),
  }));
  // filter time
  const TIME_OPTIONS: ISelectItem[] = [
    { value: PROPOSAL_TIME.OLDEST, label: t('Proposal.TheNeweset') },
    { value: PROPOSAL_TIME.LATEST, label: t('Proposal.TheOldest') },
  ];
  // filter status
  const STATUS_OPTIONS: ISelectItem[] = [
    { value: ProposalStatus.Voting, label: t('Proposal.Voting') },
    { value: ProposalStatus.Draft, label: t('Proposal.Draft') },
    { value: ProposalStatus.Rejected, label: t('Proposal.Rejected') },
    { value: ProposalStatus.WithDrawn, label: t('Proposal.WithDrawn') },
    { value: ProposalStatus.End, label: t('Proposal.End') },
  ];

  const [selectType, setSelectType] = useState<ISelectItem>();
  const [selectTime, setSelectTime] = useState<ISelectItem>(TIME_OPTIONS[0]);
  const [selectStatus, setSelectStatus] = useState<ISelectItem>();

  return (
    <Page>
      <FilterBox>
        <FilterSelect
          options={TYPE_OPTIONS}
          isSearchable={false}
          placeholder={t('Proposal.TypeSelectHint')}
          onChange={(v: ISelectItem) => setSelectType(v)}
        />
        <FilterSelect
          options={TIME_OPTIONS}
          defaultValue={TIME_OPTIONS[0]}
          isClearable={false}
          isSearchable={false}
          onChange={(v: ISelectItem) => setSelectTime(v)}
        />
        <FilterSelect
          options={STATUS_OPTIONS}
          isSearchable={false}
          placeholder={t('Proposal.StatusSelectHint')}
          onChange={(v: ISelectItem) => setSelectStatus(v)}
        />
      </FilterBox>
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
`;

const FilterBox = styled.div`
  display: flex;
  gap: 16px;
`;

const FilterSelect = styled(SeeSelect)`
  width: 180px;
`;
