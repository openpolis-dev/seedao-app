import React, { useRef } from 'react';
import { Toastr, ToastrRef } from '@paljs/ui/Toastr';

export enum ToastType {
  Success = 'Success',
  Danger = 'Danger',
}

export default function useToast() {
  const toastrRef = useRef<ToastrRef>(null);

  const showToast = (message: string, type: ToastType) => {
    toastrRef.current?.add(message, '', { status: type });
  };

  return {
    Toast: (
      <Toastr
        ref={toastrRef}
        key={1}
        position="topEnd"
        status="Primary"
        duration={3000}
        icons={{
          Danger: 'flash-outline',
          Success: 'checkmark-outline',
          Info: 'question-mark-outline',
          Warning: 'alert-triangle-outline',
          Control: 'email-outline',
          Basic: 'email-outline',
          Primary: 'checkmark-outline',
        }}
        hasIcon={true}
        destroyByClick={false}
        preventDuplicates={false}
      />
    ),
    showToast,
  };
}
