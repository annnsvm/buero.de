import React from 'react'

const GlobalLoader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-12 overflow-hidden bg-[#0a0a0b]"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative flex h-32 w-32 items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute rounded-full border-2 border-[var(--color-primary)]/40"
            style={{
              width: 48 + i * 28,
              height: 48 + i * 28,
              animation: 'ping 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <span
          className="absolute h-24 w-24 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent, var(--color-primary), transparent 40%)',
            animation: 'spin 1.2s linear infinite',
          }}
        />
        <span className="absolute h-20 w-20 rounded-full bg-[#0a0a0b]" />
        <span
          className="absolute h-3 w-3 rounded-full bg-[var(--color-primary)] shadow-[0_0_20px_var(--color-primary)]"
          style={{ animation: 'spin 1.2s linear infinite' }}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p
          className="text-lg font-semibold tracking-widest text-white/90"
          style={{
            background: 'linear-gradient(90deg, #fff 0%, var(--color-primary) 50%, #fff 100%)',
            backgroundSize: '200% 100%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        >
          LOADING
        </p>
        <div className="h-0.5 w-24 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-1/2 rounded-full bg-[var(--color-primary)]"
            style={{ animation: 'slide 1s ease-in-out infinite' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes shimmer {
          0%, 100% { background-position: 100% 0; }
          50% { background-position: 0 0; }
        }
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

export default GlobalLoader;