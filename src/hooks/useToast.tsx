import { toast } from 'react-toastify';

export enum ToastType {
  Success = 'Success',
  Danger = 'Danger',
}

export default function useToast() {
  const showToast = (message: string, type: ToastType) => {
    switch (type) {
      case ToastType.Success:
        toast.success(message, { theme: 'light' });
        break;
      case ToastType.Danger:
        toast.error(message, { theme: 'light' });
    }
  };

  return {
    Toast: <></>,
    showToast,
  };
}
