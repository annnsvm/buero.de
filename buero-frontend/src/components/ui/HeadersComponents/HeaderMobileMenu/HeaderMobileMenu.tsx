import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../Button'
import { HeaderMobileMenuProps } from '@/types/components/layout/Header.types';
import HeaderNavBar from '../HeaderNavBar/HeaderNavBar';
import HeaderAuthTrialBar from '../HeaderAuthTrialBar/HeaderAuthTrialBar';

const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({ setIsOpen, isOpen, isLight, pathname, className }) => {
    const [isAnimated, setIsAnimated] = useState(false);
    const hambuergerLine = `w-full h-0.5 transition-all duration-300 ease-in-out ${isLight ? 'bg-[var(--color-surface-card)]' : 'bg-[var(--color-text-primary)]'}`
    const toggleMenu = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(!isOpen);
        }
        if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => {
                setIsAnimated(true);
            }, 10);
        } else {
            setIsAnimated(false);
            setTimeout(() => {
                setIsOpen(false);
            }, 200)
        }
    }

    const closeMenu = useCallback(() => {
        setIsAnimated(false);
        setTimeout(() => {
            setIsOpen(false);
        }, 200)
    }, [setIsOpen]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isOpen) {
            document.body.classList.remove("no-scroll");
            document.documentElement.classList.remove("no-scroll");
            return;
        }

        document.body.classList.add("no-scroll");
        document.documentElement.classList.add("no-scroll");

        return () => {
            document.body.classList.remove("no-scroll");
            document.documentElement.classList.remove("no-scroll");
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            return;
        }
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                closeMenu();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, closeMenu]);

    const overlayClasses = [
        "fixed inset-0 z-50 bg-[var(--opacity-neutral-darkest-60)] backdrop-blur-sm",
        "transition-opacity duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
    ].join(" ");

    const panelClasses = [
        "mx-auto flex h-full w-full max-w-[480px] flex-col px-6 py-8 text-lg",
        "transition-transform duration-300",
        isOpen ? "translate-y-0" : "translate-y-4",
    ].join(" ");

    return (
        <>
            <div className={`${className}`}>
                <Button aria-label="Toggle menu" aria-expanded={isOpen} onClick={toggleMenu} styleType='mobile' className={`py-2 px-2 ${isOpen ? 'z-500' : ''}`}>
                    <span className={`flex flex-col justify-between w-5 h-4 relative ${isAnimated ? 'open' : ''}`}>
                        <span className={`${hambuergerLine} ${isOpen ? 'rotate-45 translate-x-[6px] translate-y-[7px]' : ''}`}></span>
                        <span className={`${hambuergerLine} ${isOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
                        <span className={`${hambuergerLine} ${isOpen ? '-rotate-45 translate-x-[7px] -translate-y-[6px]' : ''}`}></span>
                    </span>
                </Button>
            </div>
            <div className={overlayClasses} onClick={closeMenu}>
                <div className={panelClasses} onClick={(event) => event.stopPropagation()}>
                    <div className="flex flex-1 items-center justify-center">
                        <HeaderNavBar
                            pathname={pathname}
                            isLight={isLight}
                            className="flex flex-col items-center gap-6 min-[1024px]:hidden fs-18"
                        />
                    </div>

                    <div className="mt-6 flex flex-col gap-4 min-[1024px]:hidden">
                        <HeaderAuthTrialBar
                            isLight={isLight}
                            className="flex flex-col gap-4 w-full max-w-[280px] mx-auto"
                            from="mobile"
                        />
                    </div>
                </div>
            </div>
        </>

    )
}

export default HeaderMobileMenu