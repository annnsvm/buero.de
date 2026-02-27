type SpinnerProps = {
  className?: string;
};

const Spinner = ({ className = "" }: SpinnerProps) => {
  return (
    <span
      className={`inline-block size-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
