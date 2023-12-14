import styled, { css } from 'styled-components';
import BasicModal from './basicModal';
import { IPushDisplay } from 'type/push.type';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: IPushDisplay;
  sns: string;
  handleClose: () => void;
}

export default function PushDetailModal({ sns, data, handleClose }: IProps) {
  const { t } = useTranslation();
  return (
    <PushModal handleClose={handleClose}>
      <PushItemTop>
        <PushItemTitle>{data.title}</PushItemTitle>
        <PushItemContent>{data.content}</PushItemContent>
        <JumpBox>
          {t('Push.Href')}
          {`: `}
          <a href={data.jump_url} target="_blank" rel="noopener noreferrer">
            {data.jump_url}
          </a>
        </JumpBox>
      </PushItemTop>
      <PushItemBottom>
        <PushItemBottomLeft>
          <div className="name">{sns}</div>
          <div className="date">{data.timeDisplay}</div>
        </PushItemBottomLeft>
        <StatusTag>{t('Push.Pushed')}</StatusTag>
        {/* {data.status === PUSH_STATUS.WAITING && (
            <Button size="sm" variant="outline-primary" onClick={() => handleCancel()}>
                {t('general.cancel')}
            </Button>
        )} */}
      </PushItemBottom>
    </PushModal>
  );
}

const PushModal = styled(BasicModal)`
  padding: 0;
  width: 480px;
`;

export const PushItemTop = styled.div`
  padding: 16px 24px;
`;

export const PushItemBottom = styled.div`
  border-top: 1px solid var(--bs-border-color);
  display: flex;
  justify-content: space-between;
  padding-block: 9px;
  margin-inline: 24px;
  align-items: center;
`;

const ClipStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const PushItemTitle = styled.div`
  font-size: 16px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--bs-body-color_active);
  line-height: 22px;
  &.clip {
    ${ClipStyle}
  }
`;

export const PushItemContent = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: var(--bs-body-color);
  margin-block: 8px;
  &.clip {
    ${ClipStyle}
  }
`;

export const JumpBox = styled.div`
  font-size: 14px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: var(--bs-body-color);
  &.clip {
    ${ClipStyle}
  }
  a {
    color: #0085ff;
  }
`;

export const StatusTag = styled.span`
  display: inline-block;
  padding-inline: 8px;
  line-height: 20px;

  background: #b0b0b0;
  border-radius: 6px;
  font-size: 12px;
  color: #000;
  text-align: center;
`;

export const PushItemBottomLeft = styled.div`
  .name {
    font-size: 14px;
    color: var(--bs-body-color_active);
  }
  .date {
    font-size: 12px;
    color: var(--bs-body-color);
  }
`;
