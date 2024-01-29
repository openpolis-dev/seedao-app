import { useEffect, useState } from 'react';
import requests from 'requests';
import useQuerySNS from './useQuerySNS';
import publicJs from 'utils/publicJs';

export default function useApplicants() {
  const [applicants, setApplicants] = useState<ISelectItem[]>([]);
  const { getMultiSNS } = useQuerySNS();

  useEffect(() => {
    const getApplicants = async () => {
      try {
        const res = await requests.application.getApplicants();
        const wallets = res.data.map((item) => item.Applicant);
        const sns_map = await getMultiSNS(wallets);

        setApplicants(
          wallets.map((item) => {
            const _v = sns_map.get(item) as string;
            return {
              value: item,
              label: _v?.endsWith('.seedao') ? _v : publicJs.AddressToShow(_v, 6),
            };
          }),
        );
      } catch (error) {
        logError('getApplicants error', error);
      }
    };
    getApplicants();
  }, []);

  return applicants;
}
