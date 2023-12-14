import { NotionRenderer } from 'react-notion-x';
import { Code } from 'react-notion-x/build/third-party/code';
import { Collection } from 'react-notion-x/build/third-party/collection';
import { Equation } from 'react-notion-x/build/third-party/equation';
import { Modal } from 'react-notion-x/build/third-party/modal';
import { Pdf } from 'react-notion-x/build/third-party/pdf';
import 'assets/styles/styles.css';
import { useAuthContext } from '../../providers/authProvider';

export default function Notion({ recordMap }: any) {
  const {
    state: { theme },
  } = useAuthContext();

  const baseUrl = `${window.location.origin}/notion/`;
  const getUrl = (url: any) => {
    return `${baseUrl}${url}`;
  };

  if (!recordMap) {
    return null;
  }
  return (
    <div>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={theme}
        mapPageUrl={(url) => getUrl(url)}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
        }}
      />
    </div>
  );
}
