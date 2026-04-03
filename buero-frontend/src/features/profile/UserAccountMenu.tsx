import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useModal } from '@/components/modal';
import { selectCurrentUser } from '@/redux/slices/user/userSelectors';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { Icon, Logo } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import type { UserAccountMenuProps } from '@/types/features/profile/UserAccountMenu.types';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';


const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const displayLabelFromUser = (email: string, displayName?: string) => {
  if (displayName?.trim()) return capitalize(displayName.trim());
  const local = email.split('@')[0];
  return local ? capitalize(local.replace(/[._-]/g, ' ')) : 'Account';
};

const firstLetterFromLabel = (label: string) => {
  return label.trim().charAt(0).toUpperCase() || '?';
};


const UserAccountMenu: React.FC<UserAccountMenuProps> = ({
  isLight = false,
  from = '',
  className = ''
}) => {
  const { pushUiModal } = useModal();

  const handleContactSupport = () => {
    pushUiModal({
      type: 'contactSupport',
      subject: 'Question about course',
    });
  };

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // const label = user ? displayLabelFromUser(user.email, user.displayName) : 'Account';
  const label = user ? displayLabelFromUser(user.email, user.name) : 'Account';
  const avatarLetter = firstLetterFromLabel(label);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      closeMenu();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeMenu]);

  
  const buttonClasses = [
    'inline-flex items-center gap-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] hover:opacity-80',
    isLight ? 'text-[var(--color-white)]' : 'text-[var(--color-text-primary)]',
    from ? 'w-full justify-between' : '',
  ].filter(Boolean).join(' ');

  const panelClasses = [
    'absolute z-[120] mt-2 w-[312px] rounded-xl border border-[var(--opacity-neutral-darkest-10)] bg-white p-4 shadow-xl',
    from ? 'left-0 right-0' : 'right-0',
  ].join(' ');

  const itemClasses =
    'flex w-full items-center gap-4 px-6 py-2.5 text-left text-[0.95rem] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--opacity-neutral-darkest-5)]';

  return (
    <div ref={rootRef} className={['relative', className].filter(Boolean).join(' ')}>
      
      <button
        type="button"
        className={buttonClasses}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span 
          className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary)]"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            <span className="text-[15px] font-bold text-white">
              {avatarLetter}
            </span>
          )}
        </span>
        <span className="max-w-[140px] text-[var(--color-neutral-lighter)] truncate text-lg sm:max-w-[200px]">{label}</span>
        <Icon
          name="icon-chevron-down"
          size={24}
          className={['shrink-0 transition-transform', open ? 'rotate-180' : ''].join(' ')}
          ariaHidden
        />
      </button>

     
      {open ? (
        <>
        <div
          className="fixed inset-0 z-[119] bg-black/40 backdrop-blur-[2px]"
          aria-hidden="true"
          onClick={closeMenu}
        />
        <div className={panelClasses} role="menu">
          <div className="flex items-center justify-between px-6 pb-3">
            <Link to={ROUTES.HOME} onClick={closeMenu} className="hover:opacity-80 transition-opacity">
              <Logo width={60} height={24} isLight={false} />
            </Link>
            <button onClick={closeMenu} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              <Icon name="icon-chevrons-double" size={20} className="text-[var(--color-neutral-darkest)]"/>
            </button>
          </div>

          <div className="flex items-center gap-3 px-6 py-3">
            <span
              className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary)]"
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                <span className="text-[15px] font-bold text-white">{avatarLetter}</span>
              )}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-bold text-[var(--color-text-primary)]">{label}</span>
              <span className="max-w-[180px] truncate text-xs text-[var(--color-text-secondary)]">{user?.email || 'email@example.com'}</span>
            </div>
          </div>

          <div className="my-2 border-t border-[var(--opacity-neutral-darkest-10)]" />

          <button
            type="button"
            className={itemClasses}
            onClick={() => { closeMenu(); dispatch(openGlobalModal({ type: 'profile' })); }}
          >
            <Icon name={ICON_NAMES.COG} size={22} className="text-[var(--color-neutral-darkest)]" />
            <span className="text-[0.95rem] font-normal text-[var(--color-neutral-darkest)]">Profile</span>
          </button>
          <button
            type="button"
            className={itemClasses}
            onClick={handleContactSupport}
          >
            <Icon name={ICON_NAMES.HELP} size={22} className="text-[var(--color-neutral-darkest)]" />
            <span className="text-[0.95rem] font-normal text-[var(--color-neutral-darkest)]">Support</span>
          </button>
          <button
            type="button"
            className={itemClasses}
            onClick={() => { closeMenu(); dispatch(openGlobalModal({ type: 'logoutConfirm' })); }}
            aria-label="Logout"
          >
            <Icon name={ICON_NAMES.ARROW_RIGHT} size={22} className="text-[var(--color-neutral-darkest)]" />
            <span className="text-[0.95rem] font-normal text-[var(--color-neutral-darkest)]">Logout</span>
          </button>
        </div>
        </>
      ) : null}
    </div>
  );
};

export default UserAccountMenu;