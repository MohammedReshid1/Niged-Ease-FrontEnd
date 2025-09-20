'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Globe } from '@phosphor-icons/react/dist/ssr/Globe';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const languageOptions = [
  {
    name: 'English',
    value: 'en',
    flag: '🇬🇧',
  },
  {
    name: 'አማርኛ',
    value: 'am',
    flag: '🇪🇹',
  },
  {
    name: 'Afaan Oromoo',
    value: 'om',
    flag: '🇪🇹',
  },
];

export function LanguageSwitcher(): React.JSX.Element {
  const router = useRouter();
  const { i18n } = useTranslation();
  const pathname = usePathname();
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLanguageChange = (language: string) => {
    console.log('Changing language to:', language);
    
    // First set cookie for consistent storage
    Cookies.set('NEXT_LOCALE', language);
    
    // Then change the language in i18next
    i18n.changeLanguage(language).then(() => {
      console.log('Language changed successfully to:', i18n.language);
      console.log('Resources loaded:', i18n.services.resourceStore.data);
      console.log('Admin namespace available:', i18n.hasResourceBundle(language, 'admin'));
      
      // Force reload the page instead of just refreshing the router
      // This ensures all translations are properly applied
      window.location.reload();
    });
    
    handleClose();
  };
  
  // Get current language information
  const currentLanguage = languageOptions.find((option) => option.value === i18n.language) || languageOptions[0];
  
  return (
    <React.Fragment>
      <Button
        onClick={handleClick}
        color="inherit"
        sx={{ 
          minWidth: 'auto',
          borderRadius: '8px',
          py: 0.75,
          px: 1.5,
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          '&:hover': {
            backgroundColor: 'rgba(20, 184, 166, 0.05)',
            borderColor: 'rgba(20, 184, 166, 0.3)',
          },
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease'
        }}
        startIcon={<Globe size={18} weight="regular" color="rgba(20, 184, 166, 0.9)" />}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.85rem', 
            fontWeight: 500,
            display: { xs: 'none', sm: 'block' }
          }}
        >
          {currentLanguage.name}
        </Typography>
        <span style={{ fontSize: '1.1rem' }}>{currentLanguage.flag}</span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: -5,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'rotate(45deg)',
              zIndex: 0,
              borderTop: '1px solid',
              borderLeft: '1px solid',
              borderColor: 'inherit',
            }
          }
        }}
        MenuListProps={{
          'aria-labelledby': 'language-button',
          sx: { py: 0.5 }
        }}
      >
        {languageOptions.map((option) => (
          <MenuItem 
            key={option.value}
            selected={i18n.language === option.value}
            onClick={() => handleLanguageChange(option.value)}
            sx={{
              px: 2,
              py: 1.2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              minWidth: 160,
              borderRadius: '4px',
              mx: 0.5,
              my: 0.2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(20, 184, 166, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(20, 184, 166, 0.12)',
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
              }
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{option.flag}</span>
            <Typography 
              variant="body2"
              sx={{ 
                fontWeight: i18n.language === option.value ? 600 : 400,
                color: i18n.language === option.value ? 'primary.main' : 'text.primary'
              }}
            >
              {option.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

// Add default export for dynamic import
export default LanguageSwitcher; 