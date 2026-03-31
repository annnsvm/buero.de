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


const displayLabelFromUser = (email: string, displayName?: string) => {
  if (displayName?.trim()) return displayName.trim();
  const local = email.split('@')[0];
  return local ? local.replace(/[._-]/g, ' ') : 'Account';
};

const firstLetterFromLabel = (label: string) => {
  return label.trim().charAt(0).toUpperCase() || '?';
};

const stringToColor = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
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
  const avatarBgColor = stringToColor(label); 

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
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full flex items-center justify-center shadow-sm"
          style={!user?.avatarUrl ? { backgroundColor: avatarBgColor } : {}}
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
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
        <div className={panelClasses} role="menu">
          
          <div className="flex items-center justify-between px-6 pb-4">
            <Link to={ROUTES.HOME} onClick={closeMenu} className="hover:opacity-80 transition-opacity">
              <Logo width={86} height={44} isLight={false} />
            </Link>
            <button onClick={closeMenu} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              <Icon name="icon-chevrons-double" size={24} className="text-[var(--color-neutral-darkest)]"/>
            </button>
          </div> 
          <button
            type="button"
            className={itemClasses}
            onClick={() => { closeMenu(); dispatch(openGlobalModal({ type: 'profile' })); }}
          >
            <Icon name="icon-cog" size={24} className="text-[var(--color-neutral-darkest)]" />
            <span className="text-lg font-normal text-[var(--color-neutral-darkest)]">Profile</span>
          </button>
          <button 
            type="button" 
            className={itemClasses} 
            onClick={handleContactSupport}
          >
           <Icon name="icon-help" size={24} className="text-[var(--color-neutral-darkest)]" />
            <span className="text-lg font-normal text-[var(--color-neutral-darkest)]">Support</span>
          </button>
         
          <button 
              type="button" 
              onClick={() => { closeMenu(); dispatch(openGlobalModal({ type: 'logoutConfirm' })); }}
              // className={itemClasses} 
              className="ml-6 py-2 px-3 border radius-lg text-[var(--color-neutral-darker)] hover:text-[var(--color-text-primary)] transition-colors rounded-full hover:bg-[var(--opacity-neutral-darkest-10)]"
              aria-label="Logout options"
            > Logout
               
            </button>
          <div className="flex items-center justify-between px-6 pt-2 pb-1">
            <div className="flex items-center gap-3">
              <span 
                className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full flex items-center justify-center shadow-sm"
                style={!user?.avatarUrl ? { backgroundColor: avatarBgColor } : {}}
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[16px] font-bold text-white">
                    {avatarLetter}
                  </span>
                )}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--color-text-primary)]">{label}</span>
                <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[130px]">{user?.email || 'email@example.com'}</span>
              </div>
            </div>
            
           
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserAccountMenu;