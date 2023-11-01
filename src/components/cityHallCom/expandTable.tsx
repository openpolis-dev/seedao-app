import styled from 'styled-components';
import { IApplicationDisplay } from 'type/application.type';
import NoItem from 'components/noItem';
import publicJs from 'utils/publicJs';
import { useTranslation } from 'react-i18next';
import BackIconSVG from 'components/svgs/back';
import ApplicationStatusTag from 'components/common/applicationStatusTag';

interface IProps {
  list: IApplicationDisplay[];
  handleClose: () => void;
}

export default function ExpandTable({ list, handleClose }: IProps) {
  const { t } = useTranslation();
  const formatSNS = (name: string) => {
    return name?.startsWith('0x') ? publicJs.AddressToShow(name) : name;
  };
  return (
    <TableBox>
      <BackBox onClick={handleClose}>
        <BackIcon>
          <BackIconSVG />
        </BackIcon>
        <span>{t('general.back')}</span>
      </BackBox>
      {list.length ? (
        <>
          <table className="table" cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>{t('application.Receiver')}</th>
                <th className="center">{t('application.AddAssets')}</th>
                <th className="center">{t('application.Season')}</th>
                <th>{t('application.Content')}</th>
                <th className="center">{t('application.BudgetSource')}</th>
                <th className="center">{t('application.Operator')}</th>
                <th>{t('application.State')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.application_id}>
                  <td>{formatSNS(item.receiver_name || '')}</td>
                  <td className="center">{item.asset_display}</td>
                  <td className="center">{item.season_name}</td>
                  <td>{item.detailed_type}</td>
                  <td className="center">{item.budget_source}</td>
                  <td className="center">{formatSNS(item.submitter_name)}</td>
                  <td>
                    <ApplicationStatusTag status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <NoItem />
      )}
    </TableBox>
  );
}

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 3rem;
  position: absolute;
  left: 0;
  top: 0;
  min-height: 100%;
`;

const BackBox = styled.div`
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  color: var(--bs-primary);
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--bs-body-color);
`;

const BackIcon = styled.span`
  display: inline-block;
  width: 32px;
  height: 32px;
  background-color: var(--bs-box-background);
  border-radius: 8px;
  text-align: center;
  svg {
    margin-top: 8px;
  }
`;
