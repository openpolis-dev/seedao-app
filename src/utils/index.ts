import { ApplicationStatus } from 'type/application.type';

export const formatApplicationStatus = (status: ApplicationStatus, isProj?: boolean) => {
  if (isProj) {
    if (status === ApplicationStatus.Approved || status === ApplicationStatus.Completed) {
      return 'Project.Approved';
    }
  }
  switch (status) {
    case ApplicationStatus.Open:
      return 'Project.ToBeReviewed';
    case ApplicationStatus.Approved:
      return 'Project.ToBeIssued';
    case ApplicationStatus.Rejected:
      return 'Project.Rejected';
    case ApplicationStatus.Processing:
      return 'Project.Sending';
    case ApplicationStatus.Completed:
      return 'Project.Sended';
    default:
      return '';
  }
};
