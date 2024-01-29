import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { isAndroid, isIOS, isMobile, isPad } from 'utils/userAgent';
import AppIcon from 'assets/images/app.png';
import ShareIcon from 'assets/images/install/share.svg';
import AddIcon from 'assets/images/install/add.svg';
import { useTranslation } from 'react-i18next';

console.log('[isAndroid]:', isAndroid);
console.log('[isiOS]:', isIOS);

export default function InstallCheck() {
  const { t } = useTranslation();
  const [isInstalled, setIsInstalled] = useState(true);

  useEffect(() => {
    // @ts-ignore
    if (window.navigator?.standalone === true || window.matchMedia('(display-mode: standalone)').matches) {
      console.log('isInstalled: true. Already in standalone mode');
      setIsInstalled(true);
    } else {
      console.log('isInstalled: false');
      setIsInstalled(false);
    }
  }, []);
  const deferredPrompt = useRef();

  const handleBeforeInstallPromptEvent = (event: any) => {
    event.preventDefault();
    deferredPrompt.current = event;
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPromptEvent);
    return function cleanup() {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPromptEvent);
    };
  }, []);

  const installApp = async () => {
    const current = deferredPrompt.current as any;
    console.log('[installApp] deferredPrompt:', current);
    if (!current) {
      return;
    }
    current
      .prompt()
      .then(() => current.userChoice)
      .then(({ outcome }: { outcome: string }) => {
        console.log('[installApp] outcome:', outcome);
      })
      .catch((error: Error) => {
        logError('[installApp] error:', error);
      });
  };

  if (isInstalled || !isPad) {
    return <></>;
  }
  if (isAndroid) {
    return (
      <AndroidBox>
        <div className="left">
          <img src={AppIcon} alt="" />
          <span>SeeDAO</span>
        </div>
        <div>
          <div className="btn-button" onClick={installApp}>
            {t('install.androidInstall')}
          </div>
        </div>
      </AndroidBox>
    );
  }
  if (isIOS) {
    return (
      <IOSBox>
        <div className="header">{t('install.iosTitle')}</div>
        <div className="bottom">
          <Step>
            <img src={ShareIcon} alt="" />
            <span>{t('install.iosStep1')}</span>
          </Step>
          <Step>
            <img src={AddIcon} alt="" />
            <span>{t('install.iosStep2')}</span>
          </Step>
        </div>
      </IOSBox>
    );
  }
  return <></>;
}

const AndroidBox = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  padding-inline: 20px;
  align-items: center;
  img {
    width: 36px;
    margin-right: 10px;
  }
  .btn-button {
    cursor: pointer;
    line-height: 36px;
    padding-inline: 15px;
    border-radius: 4px;
    background-color: var(--bs-primary);
    color: #fff;
  }
`;

const IOSBox = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(215, 215, 215);
  border-radius: 10px 10px 0 0;
  .header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 18px;
    color: #333;
    padding: 13px 16px;
    font-weight: 500;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  .bottom {
    padding-block: 20px;
  }
`;

const Step = styled.div`
  color: #7b7b7a;
  display: flex;
  gap: 20px;
  align-items: center;
  padding-inline: 16px;
  font-size: 13px;
  &:first-child {
    margin-bottom: 16px;
  }
  img {
    width: 24px;
  }
`;
