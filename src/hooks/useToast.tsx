import { toast, ToastOptions } from 'react-toastify';

export enum ToastType {
  Success = 'Success',
  Danger = 'Danger',
}

export default function useToast() {
  const showToast = (message: string, type: ToastType, config?: ToastOptions) => {
    switch (type) {
      case ToastType.Success:
        toast.success(message, { theme: 'light', ...config });
        break;
      case ToastType.Danger:
        toast.error(message, { theme: 'light', ...config });
    }
  };

  return {
    Toast: <></>,
    showToast,
  };
}
