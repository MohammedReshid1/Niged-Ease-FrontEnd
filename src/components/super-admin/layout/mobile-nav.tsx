'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';
import { useTranslation } from 'react-i18next';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { superAdminNavItems } from '@/components/dashboard/layout/config';
import { navIcons } from '@/components/dashboard/layout/nav-icons';

// Dynamically import the LanguageSwitcher with SSR disabled to prevent hydration errors
const LanguageSwitcher = dynamic(
  () => import('@/components/core/language-switcher').then(mod => mod.LanguageSwitcher),
  { ssr: false }
);

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
}

export function MobileNav({ open, onClose }: MobileNavProps): React.JSX.Element {
  const pathname = usePathname();
  const { t } = useTranslation('superAdmin');

  return (
    <Drawer
      PaperProps={{
        sx: {
          '--MobileNav-background': 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          '--MobileNav-color': 'var(--mui-palette-common-white)',
          '--NavItem-color': 'var(--mui-palette-neutral-300)',
          '--NavItem-hover-background': 'rgba(255, 255, 255, 0.06)',
          '--NavItem-active-background': 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
          '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
          '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
          bgcolor: 'var(--MobileNav-background)',
          color: 'var(--MobileNav-color)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          scrollbarWidth: 'none',
          width: 'var(--MobileNav-width)',
          zIndex: 'var(--MobileNav-zIndex)',
          '&::-webkit-scrollbar': { display: 'none' },
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box 
          component={RouterLink} 
          href={paths.superAdmin.dashboard} 
          sx={{ 
            display: 'inline-flex',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          <Logo color="dark" height={40} width={150} />
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            backgroundImage: 'linear-gradient(to right, rgba(20, 184, 166, 0.1), rgba(99, 102, 241, 0.05))',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(20, 184, 166, 0.3)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            p: '10px 16px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'rgba(20, 184, 166, 0.5)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography color="var(--mui-palette-neutral-400)" variant="body2" sx={{ fontWeight: 500 }}>
              {t('common.role')}
            </Typography>
            <Typography color="inherit" variant="subtitle1" sx={{ fontWeight: 600 }}>
              {t('common.super_admin')}
            </Typography>
          </Box>
          <CaretUpDownIcon />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '16px' }}>
        {renderNavItems({ pathname, items: superAdminNavItems, t })}
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
      <Stack spacing={2} sx={{ p: '16px', mb: 2 }}>
        <div>
          <Typography color="var(--mui-palette-neutral-100)" variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t('common.need_help')}
          </Typography>
          <Typography color="var(--mui-palette-neutral-400)" variant="body2">
            {t('common.contact_support')}
          </Typography>
        </div>
        <Button
          component={RouterLink}
          endIcon={<ArrowSquareUpRightIcon fontSize="var(--icon-fontSize-md)" />}
          fullWidth
          href="/contact"
          sx={{ 
            mt: 2,
            borderRadius: '10px',
            py: 1,
            background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
            boxShadow: '0 6px 12px rgba(20, 184, 166, 0.2)',
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'all 0.6s ease',
            },
            '&:hover': {
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
              transform: 'translateY(-2px)',
              '&::before': {
                left: '100%',
              }
            }
          }}
          variant="contained"
        >
          {t('common.contact_support_button')}
        </Button>
        
        <Box sx={{ mt: 2 }}>
          <Typography color="var(--mui-palette-neutral-100)" variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {t('common.language')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Stack>
    </Drawer>
  );
}

function renderNavItems({ items = [], pathname, t }: { items?: NavItemConfig[]; pathname: string; t: any }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, title, ...item } = curr;

    acc.push(<NavItem key={key} title={title} pathname={pathname} t={t} {...item} />);

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  t: any;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title = '', t }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  // Translate the menu title using the namespace approach
  const translationKey = `navigation.${title.toLowerCase().replace(/\s+/g, '_')}`;
  const translatedTitle = t(translationKey, title); // Falls back to original title if translation not found

  return (
    <li>
      <Box
        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: '12px',
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1.5,
          p: '10px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            bgcolor: active ? 'var(--NavItem-active-background)' : 'var(--NavItem-hover-background)',
            transform: 'translateX(4px)',
            color: active ? 'var(--NavItem-active-color)' : 'var(--mui-palette-common-white)',
          },
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && { 
            bgcolor: 'var(--NavItem-active-background)', 
            color: 'var(--NavItem-active-color)',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
          }),
        }}
      >
        <Box 
          sx={{ 
            alignItems: 'center', 
            display: 'flex', 
            justifyContent: 'center', 
            flex: '0 0 auto',
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            ...(active && {
              background: 'rgba(255, 255, 255, 0.1)',
            })
          }}
        >
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ 
              color: 'inherit', 
              fontSize: '0.9rem', 
              fontWeight: active ? 600 : 500, 
              lineHeight: '24px',
              letterSpacing: '0.01em',
            }}
          >
            {translatedTitle}
          </Typography>
        </Box>
      </Box>
    </li>
  );
} 