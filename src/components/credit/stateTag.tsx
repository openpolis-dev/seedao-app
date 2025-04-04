import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CreditRecordStatus } from 'type/credit.type';

export default function StateTag({ state, solid }: { state: CreditRecordStatus; solid?: boolean }) {
  const { t } = useTranslation();
  let color: string = '';
  let text: string;
  let bg: string = 'transparent';
  switch (state) {
    case CreditRecordStatus.OVERDUE:
      color = '#FE5C73';
      text = t('Credit.RecordOverdue');
      if (solid) {
        bg = '#FE5C73';
      }
      break;
    case CreditRecordStatus.INUSE:
      color = '#1814F3';
      text = t('Credit.RecordInUse');
      if (solid) {
        bg = '#1814F3';
      }
      break;
    case CreditRecordStatus.CLEAR:
      color = '#16DBAA';
      text = t('Credit.RecordClear');
      if (solid) {
        bg = '#16DBAA';
      }
      break;
    default:
      text = '';
  }
  if (solid) {
    color = 'white';
  }

  return (
    <StatusTagStyle
      $color={color}
      $bg={bg}
      style={{ textAlign: solid ? 'center' : 'left', fontSize: solid ? '12px' : '14px' }}
    >
      {text}
    </StatusTagStyle>
  );
}

const StatusTagStyle = styled.div<{ $color: string; $bg: string }>`
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  border-radius: 4px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  width: 60px;
`;
