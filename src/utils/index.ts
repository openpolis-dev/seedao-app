import { ApplicationStatus } from 'type/application.type';

export const formatApplicationStatus = (status: ApplicationStatus) => {
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
