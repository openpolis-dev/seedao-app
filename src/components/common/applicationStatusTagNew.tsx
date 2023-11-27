import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ApplicationStatus } from 'type/application.type';

interface IProps {
  status: ApplicationStatus;
  isProj?: boolean;
}

export default function ApplicationStatusTagNew({ status, isProj }: IProps) {
  const { t } = useTranslation();

  const [statusText, color] = useMemo(() => {
    if (isProj) {
      if (status === ApplicationStatus.Approved || status === ApplicationStatus.Completed) {
        return [t('Project.Approved'), '#1F9E14'];
      }
    }
    switch (status) {
      case ApplicationStatus.Open:
        return [t('Project.ToBeReviewed'), '#f9b617'];
      case ApplicationStatus.Approved:
        return [t('Project.ToBeIssued'), '#f9b617'];
      case ApplicationStatus.Rejected:
        return [t('Project.Rejected'), '#FF7193'];
      case ApplicationStatus.Processing:
        return [t('Project.Sending'), '#2F8FFF'];
      case ApplicationStatus.Completed:
        return [t('Project.Sended'), '#1F9E14'];
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

const Tag = styled.span<{ color: string }>`
  background: ${({ color }) => color || '#ccc'};
  padding: 4px 19px;
  border-radius: 8px;
  .text {
    color: #fff;
    font-size: 12px;
  }
`;
