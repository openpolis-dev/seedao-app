import * as Sentry from '@sentry/react';
import React, { PropsWithChildren, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import CopyBox from 'components/copy';
import CopyIconSVG from 'assets/Imgs/copy.svg';

const FallbackWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const BodyWrapper = styled.div<{ margin?: string }>`
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding: 1rem;
`;

const StretchedRow = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
  > * {
    flex: 1;
  }
  button {
    width: 100%;
  }
`;

const Code = styled.code`
  font-weight: 485;
  font-size: 12px;
  line-height: 16px;
  word-wrap: break-word;
  width: 100%;
  overflow: scroll;
  max-height: calc(100vh - 450px);
`;

const Separator = styled.div`
  border-bottom: 1px solid #ddd;
`;

const CodeBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
`;

const ShowMoreButton = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: space-between;
`;

const CodeTitle = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  word-break: break-word;
`;

const Content = styled.div`
  padding: 24px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 24px;
`;

const Fallback = ({ error, eventId }: { error: Error; eventId: string | null }) => {
  const [isExpanded, setExpanded] = useState(false);
  const showErrorId = eventId;

  const showMoreButton = (
    <ShowMoreButton onClick={() => setExpanded((s) => !s)}>
      {isExpanded ? 'Show less' : 'Show more'}
    </ShowMoreButton>
  );

  const errorDetails = error.stack || error.message;

  return (
    <FallbackWrapper>
      <BodyWrapper>
        <Content>
          {showErrorId ? (
            <>
              <div>
                <div>Something went wrong</div>
                <div>
                  Sorry, an error occured while processing your request. If you request support, be sure to provide your
                  error ID.
                </div>
              </div>
              <CodeBlockWrapper>
                <CodeTitle>
                  <div>Error ID: {eventId}</div>
                  <CopyBox text={eventId}>
                    <img src={CopyIconSVG} alt="" />
                  </CopyBox>
                </CodeTitle>
                <Separator />
                {isExpanded && <Code>{errorDetails}</Code>}
                {showMoreButton}
              </CodeBlockWrapper>
            </>
          ) : (
            <>
              <div>
                <div>Something went wrong</div>
                <div>
                  Sorry, an error occured while processing your request. If you request support, be sure to copy the
                  details of this error.
                </div>
              </div>
              <CodeBlockWrapper>
                <CodeTitle>
                  <div>Error details</div>
                  <CopyBox text={errorDetails}>
                    <img src={CopyIconSVG} alt="" />
                  </CopyBox>
                </CodeTitle>
                <Separator />
                <Code>{errorDetails?.split('\n').slice(0, isExpanded ? undefined : 4)}</Code>
                {showMoreButton}
              </CodeBlockWrapper>
            </>
          )}
        </Content>

        <StretchedRow>
          <span>
            <Button onClick={() => window.location.reload()}>Reload the app</Button>
          </span>
          <a href="https://seedao.canny.io/feedback " target="_blank" rel="noreferrer">
            <Button>Report</Button>
          </a>
        </StretchedRow>
      </BodyWrapper>
    </FallbackWrapper>
  );
};

async function updateServiceWorker(): Promise<ServiceWorkerRegistration> {
  const ready = await navigator.serviceWorker.ready;
  // the return type of update is incorrectly typed as Promise<void>. See
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
  return ready.update() as unknown as Promise<ServiceWorkerRegistration>;
}

const updateServiceWorkerInBackground = async () => {
  try {
    const registration = await updateServiceWorker();

    // We want to refresh only if we detect a new service worker is waiting to be activated.
    // See details about it: https://web.dev/service-worker-lifecycle/
    if (registration?.waiting) {
      await registration.unregister();

      // Makes Workbox call skipWaiting().
      // For more info on skipWaiting see: https://web.dev/service-worker-lifecycle/#skip-the-waiting-phase
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  } catch (error) {
    console.error('Failed to update service worker', error);
  }
};

export default function ErrorBoundary({ children }: PropsWithChildren): JSX.Element {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, eventId }) => <Fallback error={error} eventId={eventId} />}
      beforeCapture={(scope) => {
        scope.setLevel('fatal');
      }}
      onError={() => {
        updateServiceWorkerInBackground();
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
