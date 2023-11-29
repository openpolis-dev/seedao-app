import { useTranslation } from 'react-i18next';

export default function useAssets() {
  const { t } = useTranslation();
  return [{ label: t('application.AllAssets') }, { value: 'SCR', label: 'SCR' }, { value: 'USDT', label: 'USDT' }];
}
