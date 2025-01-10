import { useState } from 'react';

const usePdfSource = (): [
  { uri: string; cache: boolean },
  (newUri: string) => void
] => {
  const [source, setSource] = useState({ uri: 'bundle-assets://sample.pdf', cache: true });

  const changeSource = (newUri: string) => {
    setSource({ uri: newUri, cache: true });
  };

  return [source, changeSource];
};

export default usePdfSource;
