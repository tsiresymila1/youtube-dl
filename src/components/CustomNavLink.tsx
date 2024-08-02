import { forwardRef, useCallback } from 'react'
import type { NavLinkProps as BaseNavLinkProps } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { useDrawerContext } from "@/components/layout/DrawerProvider.tsx";

export interface NavLinkProps extends BaseNavLinkProps {
    activeclass?: string
}

export const CustomNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
    (props, ref) => {
        const {mobileOpen, toggleDrawer} = useDrawerContext()
        const hiddenDrawer = useCallback(() => {
            if (mobileOpen) {
                toggleDrawer()
            }
        }, [mobileOpen, toggleDrawer])
        return <NavLink
            ref={ref}
            {...props}
            onClick={(e) => {
                hiddenDrawer()
                props.onClick?.(e)
            }}
            className={({isActive}) =>
                [
                    props.className,
                    isActive && props.to.toString() !== '#'
                        ? props.activeclass
                        : null,
                ]
                    .filter(Boolean)
                    .join(' ')}
        />
    }
)
