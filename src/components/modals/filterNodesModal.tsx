import styled from 'styled-components';
import BasicModal from './basicModal';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import ExcellentExport from 'excellentexport';
import NoItem from 'components/noItem';

interface IProps {
  filterActiveNum: string;
  filterEffectiveNum: string;
  season: string;
  handleClose: () => void;
  walletList: string[];
}

export default function FilterNodesNodal({
  filterActiveNum,
  filterEffectiveNum,
  season,
  walletList,
  handleClose,
}: IProps) {
  const { t } = useTranslation();
  const handleExport = () => {
    ExcellentExport.convert(
      { filename: t('GovernanceNodeResult.FilterNodesFilename', { season }), format: 'xlsx', openAsDownload: true },
      [
        {
          name: t('GovernanceNodeResult.FilterNodesFilename', { season }),
          from: {
            array: [...walletList.map((item) => [item])],
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
      <Statics>
        <span>
          {t('GovernanceNodeResult.ActiveSCR')}: {filterActiveNum}
        </span>
        <span>
          {t('GovernanceNodeResult.EffectiveSCR')}: {filterEffectiveNum}
        </span>
        <span>{t('GovernanceNodeResult.FilterNodesCount', { count: walletList.length })}</span>
      </Statics>

      <SNSList>
        {walletList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
        {!walletList.length && (
          <li>
            <NoItem />
          </li>
        )}
      </SNSList>
      <ButtonLine>
        {!!walletList.length && (
          <Button className="btn-export" variant="primary" onClick={handleExport}>
            {t('GovernanceNodeResult.ExportBtn')}
          </Button>
        )}
      </ButtonLine>
    </FilterNodesModalStyle>
  );
}

const FilterNodesModalStyle = styled(BasicModal)`
  min-width: 470px;
  .btn-export {
    height: 34px;
    margin-top: 15px;
  }
`;

const ButtonLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Statics = styled.div`
  display: flex;
  justify-content: center;
  font-size: 14px;
  background: var(--table-header);
  border-radius: 8px;
  padding: 12px 0;
  span {
    display: inline-block;
    width: 33.333%;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--bs-body-color_active);
    line-height: 20px;
  }
`;

const SNSList = styled.ul`
  max-height: 60vh;
  overflow-y: auto;
  line-height: 48px;
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
