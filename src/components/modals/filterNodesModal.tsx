import styled from 'styled-components';
import BasicModal from './basicModal';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import ExcellentExport from 'excellentexport';
import NoItem from 'components/noItem';

interface IProps {
  season: string;
  handleClose: () => void;
  snsList: string[];
}

export default function FilterNodesNodal({ season, snsList, handleClose }: IProps) {
  const { t } = useTranslation();
  const handleExport = () => {
    ExcellentExport.convert(
      { filename: t('GovernanceNodeResult.FilterNodesFilename', { season }), format: 'xlsx', openAsDownload: true },
      [
        {
          name: t('GovernanceNodeResult.FilterNodesFilename', { season }),
          from: {
            array: [...snsList.map((item) => [item])],
          },
        },
      ],
    );
  };
  return (
    <FilterNodesModalStyle
      title={t('GovernanceNodeResult.FilterNodesModalTitle', { season })}
      handleClose={handleClose}
    >
      {!!snsList.length && (
        <Button className="btn-export" variant="primary" onClick={handleExport}>
          {t('GovernanceNodeResult.Export')}
        </Button>
      )}

      <SNSList>
        {snsList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
        {!snsList.length && (
          <li>
            <NoItem />
          </li>
        )}
      </SNSList>
    </FilterNodesModalStyle>
  );
}

const FilterNodesModalStyle = styled(BasicModal)`
  min-width: 430px;
  .btn-export {
    position: absolute;
    right: 0;
    top: 14px;
    height: 34px;
  }
`;
const SNSList = styled.ul`
  max-height: 60vh;
  overflow-y: auto;
  line-height: 36px;
  font-size: 14px;
  color: var(--bs-body-color_active);
  padding-inline: 10px;
  li {
    border-bottom: 1px solid var(--bs-border-color);
    &:last-child {
      border-bottom: none;
    }
  }
`;
