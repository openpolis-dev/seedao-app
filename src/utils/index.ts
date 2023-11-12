import { ApplicationStatus } from 'type/application.type';
import getConfig from './envCofnig';

export const formatApplicationStatus = (status: ApplicationStatus, isProj?: boolean): any => {
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

export const isNotOnline = () => {
  return process.env.REACT_APP_ENV_VERSION !== 'prod';
};
