type TapHintProps = {
  visible: boolean;
  className?: string;
  emoji?: string;
};

const TapHint = ({ visible, className = '', emoji = '👆' }: TapHintProps) => {
  if (!visible) return null;

  return (
    <span
      className={['buero-tap-hint pointer-events-none select-none', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
};

export default TapHint;
