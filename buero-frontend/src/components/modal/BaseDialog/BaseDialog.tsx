import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import { BaseDialogProps } from '@/types/components/modal/BaseDialog.types';
import { Title, Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import React, { useCallback, useEffect, useRef } from 'react';

const CONTENT_OUT_ANIMATION_NAME = 'buero-dialog-content-out';

const syncVisualViewportCssVars = () => {
  const root = document.documentElement;
  const vv = window.visualViewport;
  if (!vv) {
    root.style.setProperty('--buero-vv-height', `${window.innerHeight}px`);
    root.style.setProperty('--buero-vv-top', '0px');
    return;
  }
  root.style.setProperty('--buero-vv-height', `${vv.height}px`);
  root.style.setProperty('--buero-vv-top', `${vv.offsetTop}px`);
};

const clearVisualViewportCssVars = () => {
  const root = document.documentElement;
  root.style.removeProperty('--buero-vv-height');
  root.style.removeProperty('--buero-vv-top');
};

const BaseDialog: React.FC<BaseDialogProps> = ({
  isOpen,
  handleOpenChange,
  openCloseAnimation = false,
  onExitAnimationComplete,
  contentClassName,
  closeButtonClassName,
  closeIconColor,
  children,
}) => {
  const exitNotifiedRef = useRef(false);
  const fallbackCloseTimerRef = useRef<number | undefined>(undefined);

  const notifyExitComplete = useCallback(() => {
    if (!onExitAnimationComplete) {
      return;
    }
    if (exitNotifiedRef.current) {
      return;
    }
    exitNotifiedRef.current = true;
    onExitAnimationComplete();
  }, [onExitAnimationComplete]);

  useEffect(() => {
    if (isOpen) {
      exitNotifiedRef.current = false;
    }
  }, [isOpen]);

  /** Keep dialog inside the visible Safari viewport (toolbar / keyboard). */
  useEffect(() => {
    if (!isOpen) {
      clearVisualViewportCssVars();
      return;
    }

    syncVisualViewportCssVars();
    const vv = window.visualViewport;
    vv?.addEventListener('resize', syncVisualViewportCssVars);
    vv?.addEventListener('scroll', syncVisualViewportCssVars);
    window.addEventListener('resize', syncVisualViewportCssVars);

    return () => {
      vv?.removeEventListener('resize', syncVisualViewportCssVars);
      vv?.removeEventListener('scroll', syncVisualViewportCssVars);
      window.removeEventListener('resize', syncVisualViewportCssVars);
      clearVisualViewportCssVars();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!openCloseAnimation || !onExitAnimationComplete || isOpen) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delayMs = reducedMotion ? 50 : 320;
    fallbackCloseTimerRef.current = window.setTimeout(notifyExitComplete, delayMs);

    return () => {
      if (fallbackCloseTimerRef.current !== undefined) {
        window.clearTimeout(fallbackCloseTimerRef.current);
        fallbackCloseTimerRef.current = undefined;
      }
    };
  }, [isOpen, openCloseAnimation, onExitAnimationComplete, notifyExitComplete]);

  const handleContentAnimationEnd = useCallback(
    (event: React.AnimationEvent<HTMLDivElement>) => {
      if (!openCloseAnimation || !onExitAnimationComplete || isOpen) {
        return;
      }
      if (event.target !== event.currentTarget) {
        return;
      }
      if (event.animationName !== CONTENT_OUT_ANIMATION_NAME) {
        return;
      }
      if (fallbackCloseTimerRef.current !== undefined) {
        window.clearTimeout(fallbackCloseTimerRef.current);
        fallbackCloseTimerRef.current = undefined;
      }
      notifyExitComplete();
    },
    [openCloseAnimation, onExitAnimationComplete, isOpen, notifyExitComplete],
  );
  const defaultContentClass =
    'buero-dialog-panel-max fixed top-1/2 left-1/2 z-[10101] w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 focus:outline-none lg:p-12';
  const animatedShellClass = [
    'buero-dialog-content-animate',
    'buero-dialog-shell',
    'buero-dialog-shell--padded',
    'fixed z-[10101] flex origin-center items-center justify-center focus:outline-none',
  ].join(' ');
  const defaultAnimatedPanelClass =
    'buero-dialog-panel-max relative w-full max-w-[480px] pointer-events-auto overflow-y-auto rounded-2xl bg-white p-6 lg:p-12';
  const overlayClass = [
    'buero-dialog-shell',
    'fixed z-[10100] bg-black/40',
    openCloseAnimation ? 'buero-dialog-overlay-animate' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const mergedContentClass = [contentClassName ?? defaultContentClass].filter(Boolean).join(' ');
  const mergedAnimatedPanelClass = [
    contentClassName ?? defaultAnimatedPanelClass,
    'pointer-events-auto',
    'max-h-full',
  ]
    .filter(Boolean)
    .join(' ');
  const closeClasses = [
    'absolute right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 sm:right-6 sm:top-6 md:right-8 md:top-8',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
    closeButtonClassName ?? 'text-[var(--color-neutral-darkest)] hover:text-[var(--color-primary)]',
  ].join(' ');
  const contentPointerEventsStyle = { pointerEvents: 'auto' as const };

  /** Full-screen animated shell sits above the overlay; treat empty shell clicks as dismiss. */
  const handleShellPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        handleOpenChange(false);
      }
    },
    [handleOpenChange],
  );

  if (openCloseAnimation) {
    return (
      <Root open={isOpen} onOpenChange={handleOpenChange}>
        <Portal>
          <Overlay className={overlayClass} />
          <Content
            aria-describedby={undefined}
            className={animatedShellClass}
            style={contentPointerEventsStyle}
            onPointerDown={handleShellPointerDown}
            onAnimationEnd={onExitAnimationComplete ? handleContentAnimationEnd : undefined}
          >
            <Title asChild>
              <span className="sr-only">Modal</span>
            </Title>
            <div className={mergedAnimatedPanelClass} style={{ pointerEvents: 'auto' }}>
              {children}
              <Close type="button" className={closeClasses} aria-label="Close dialog">
                <Icon
                  name={ICON_NAMES.X}
                  className="pointer-events-none"
                  color={closeIconColor ?? 'currentColor'}
                />
              </Close>
            </div>
          </Content>
        </Portal>
      </Root>
    );
  }

  return (
    <Root open={isOpen} onOpenChange={handleOpenChange}>
      <Portal>
        <Overlay className={overlayClass} />
        <Content
          aria-describedby={undefined}
          className={mergedContentClass}
          style={contentPointerEventsStyle}
        >
          <Title asChild>
            <span className="sr-only">Modal</span>
          </Title>
          {children}
          <Close type="button" className={closeClasses} aria-label="Close dialog">
            <Icon
              name={ICON_NAMES.X}
              className="pointer-events-none"
              color={closeIconColor ?? 'currentColor'}
            />
          </Close>
        </Content>
      </Portal>
    </Root>
  );
};

export default BaseDialog;
