import { useState, type ReactNode } from 'react';

type AssetImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
};

/**
 * Loads a real asset when it exists. Until the file is added, the styled
 * fallback stays visible — drop a jpg at `src` and this switches automatically.
 */
const AssetImage = ({ src, alt, className = '', fallback }: AssetImageProps) => {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready ? fallback : null}
      <img
        src={src}
        alt={ready ? alt : ''}
        className={ready ? className : 'hidden'}
        onLoad={() => setReady(true)}
      />
    </>
  );
};

export default AssetImage;
