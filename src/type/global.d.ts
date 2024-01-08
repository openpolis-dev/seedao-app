declare const Card: React.FC<CardProps> & { children: React.Element };

interface Window {
  chatWidgetApi: {
    thirdDIDLogin: (
      address: string,
      thirdSignFunc: ({ message: string }) => Promise<string>,
      callback: (r) => void,
    ) => any;
    createDMRoom: (userName: string) => Promise<string>;
  };
  seeDAOosApi: {
    getUsers: (wallets: string[]) => Promise<any>;
  };
  AppConfig: {
    host: string;
  };
  ethereum?: {
    isMetaMask?: true;
  };
}

declare function logError(message?: any, ...optionalParams: any[]): void;

declare interface IPageParams {
  page: number;
  size: number;
  sort_order: string;
  sort_field: string;
  status?: string;
  state?: string;
}

declare interface IPageResponse<T> {
  page: number;
  size: number;
  total: number;
  rows: T[];
}

declare interface ISelectItem {
  value: any;
  label: string;
  data?: any;
}

declare interface Number {
  format: (n?: number) => string;
}
