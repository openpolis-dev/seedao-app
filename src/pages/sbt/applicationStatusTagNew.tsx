import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function ApplicationStatusTagNew({ status }: { status: string }) {
  const { t } = useTranslation();

  const [statusText, color] = useMemo(() => {

    switch (status) {
      case "pending":
        return [t('sbt.pending'), '#f9b617'];
      case "approved":
        return [t('sbt.approved'), '#5200FF'];
      case "rejected":
        return [t('sbt.rejected'), '#FF7193'];
      case "minted":
        return [t('sbt.minted'), '#2F8FFF'];
      default:
        return ['', ''];
    }
  }, [status, t]);
  return (
    <Tag color={color}>
      <span className="text">{statusText}</span>
    </Tag>
  );
}

const Tag = styled.div<{ color: string }>`
  background: ${({ color }) => color || '#ccc'};
  padding-inline: 19px;
  border-radius: 16px;
  display: inline-block;
  line-height: 24px;
  .text {
    color: #fff;
    font-size: 12px;
  }
`;
