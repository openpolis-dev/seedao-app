import { toast, ToastOptions } from 'react-toastify';
import styled from 'styled-components';
import { useAuthContext } from '../providers/authProvider';

export enum ToastType {
  Success = 'Success',
  Danger = 'Danger',
}

export default function useToast() {
  const {
    state: { theme },
  } = useAuthContext();

  const showToast = (message: string, type: ToastType, config?: ToastOptions) => {
    switch (type) {
      case ToastType.Success:
        toast.success(message, { theme: theme ? 'dark' : 'light', autoClose: 1300, ...config });
        break;
      case ToastType.Danger:
        toast.error(message, { theme: theme ? 'dark' : 'light', ...config });
    }
  };

  return {
    Toast: <></>,
    showToast,
  };
}
