import sns from '@seedao/sns-js';
import { useEffect, useState } from 'react';

export default function useParseSNS(wallet?: string) {
  const [name, setName] = useState<string>();

  useEffect(() => {
    if (wallet) {
      sns.name(wallet).then((res) => {
        setName(res);
      });
    }
  }, [wallet]);
  return name;
}
