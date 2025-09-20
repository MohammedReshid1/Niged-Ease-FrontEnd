"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { 
  ArrowRight, 
  FacebookLogo, 
  InstagramLogo, 
  TelegramLogo, 
  LinkedinLogo, 
  TwitterLogo, 
  SnapchatLogo,
  List as ListIcon
} from '@phosphor-icons/react/dist/ssr';
import { useTranslation } from 'react-i18next';
import Chatbot from '@/components/chat/Chatbot';

import { paths } from '@/paths';
import dynamic from 'next/dynamic';

// Dynamically import the LanguageSwitcher with SSR disabled to prevent hydration errors
const LanguageSwitcher = dynamic(
  () => import('@/components/core/language-switcher').then(mod => mod.LanguageSwitcher),
  { ssr: false }
);

export default function LandingPage(): React.JSX.Element {
  const { t, i18n } = useTranslation('common');
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);
  
  // Helper function to safely get translations with fallbacks
  const safeTranslate = (key: string, fallback: string): string => {
    const result = t(key);
    // If the result is the same as the key, it means translation failed
    return result === key ? fallback : result;
  };
  
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <Box sx={{ 
      bgcolor: 'background.default', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Elements */}
      <Box 
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '20%',
          height: '20%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, rgba(20, 184, 166, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: '30%',
          right: '-5%',
          width: '25%',
          height: '25%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Box 
        component="header" 
        sx={{ 
          position: 'relative',
          zIndex: 2,
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
        }}
      >
      <Container maxWidth="lg">
        <Box sx={{ 
          py: 2, 
          display: 'flex', 
          alignItems: 'center', 
            justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Box 
                component="img"
                src="/assets/Neged.png"
                alt="NIGED-EASE Logo"
                role="img"
                aria-label="NIGED-EASE Logo"
                sx={{
                    width: 40,
                    height: 40,
                    mr: 1.5,
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    padding: '6px',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(203, 213, 225, 0.3)',
                    objectFit: 'contain',
                    display: 'block',
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-2px)'
                    }
                }}
              />
              <Typography 
                component="span" 
                variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {safeTranslate('app_name', 'NIGED-EASE')}
                </Typography>
              </Link>
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center',
                ml: 6,
                gap: 4
              }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Typography 
                    component="span" 
                    variant="body1" 
                    sx={{ 
                      cursor: 'pointer', 
                      color: 'primary.main', 
                      fontWeight: 600,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '2px',
                        bottom: -2,
                        left: 0,
                        backgroundColor: 'primary.main',
                      }
                    }}
                  >
                    {safeTranslate('home', 'Home')}
                  </Typography>
                </Link>
                <Link href="/features" style={{ textDecoration: 'none' }}>
                  <Typography 
                    component="span" 
                    variant="body1" 
                    sx={{ 
                      cursor: 'pointer', 
                      color: 'text.primary',
                      fontWeight: 500,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'primary.main',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: -2,
                        left: 0,
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s ease'
                      },
                      '&:hover::after': {
                        width: '100%'
                      }
                    }}
                  >
                    {safeTranslate('features', 'Features')}
                  </Typography>
                </Link>
                <Link href="/contact" style={{ textDecoration: 'none' }}>
                  <Typography 
                    component="span" 
                    variant="body1" 
                    sx={{ 
                      cursor: 'pointer', 
                      color: 'text.primary',
                      fontWeight: 500,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'primary.main',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: -2,
                        left: 0,
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s ease'
                      },
                      '&:hover::after': {
                        width: '100%'
                      }
                    }}
                  >
                    {t('contact')}
                  </Typography>
                </Link>
              </Box>
            </Box>
            
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <LanguageSwitcher />
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ 
                  borderRadius: 2, 
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.3s ease',
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
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                    transform: 'translateY(-2px)',
                    '&::before': {
                      left: '100%',
                    }
                  }
                }}
                component={Link}
                href={paths.auth.signIn}
              >
                {t('login')}
              </Button>
            </Box>
            
            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{ 
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: 'rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  p: 1
                }}
              >
                <ListIcon size={24} weight="bold" />
              </IconButton>
              
              {/* Mobile Menu */}
              <Menu
                anchorEl={mobileMenuAnchor}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
                sx={{ mt: 1.5 }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleMobileMenuClose} component={Link} href="/">
                  <Typography sx={{ 
                    fontWeight: 600,
                    color: 'primary.main',
                  }}>
                    {safeTranslate('home', 'Home')}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleMobileMenuClose} component={Link} href="/features">
                  <Typography sx={{ fontWeight: 500 }}>
                    {safeTranslate('features', 'Features')}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleMobileMenuClose} component={Link} href="/contact">
                  <Typography sx={{ fontWeight: 500 }}>
                    {t('contact')}
                  </Typography>
                </MenuItem>
                <MenuItem 
                  onClick={handleMobileMenuClose} 
                  component={Link} 
                  href={paths.auth.signIn}
                  sx={{ 
                    mt: 1,
                    background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #0d9488, #4f46e5)',
                    }
                  }}
                >
                  {t('login')}
                </MenuItem>
              </Menu>
          </Box>
        </Box>
      </Container>
      </Box>

      {/* Hero Section */}
      {/* ========================= */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '20%',
            background: 'url("/assets/wave-pattern.svg")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            opacity: 0.4,
            zIndex: 0,
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0) 70%)',
            filter: 'blur(40px)',
            animation: 'pulse 8s infinite alternate ease-in-out',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 0.2 },
              '100%': { transform: 'scale(1.2)', opacity: 0.4 }
            }
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              textAlign: 'center',
              animation: 'fadeIn 1s ease',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
                <Typography variant="h1" color="text.primary" sx={{ 
                    maxWidth: '15ch',
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '3.75rem', lg: '4rem' },
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    mb: 4,
                    background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: { xs: 'center', md: 'left' },
                  }}>
                  {safeTranslate('hero_title', 'Business Management Solution for Ethiopia')}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ 
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  maxWidth: '45ch',
                  mb: 6,
                  textAlign: { xs: 'center', md: 'left' },
                  lineHeight: 1.6,
                }}>
                  {safeTranslate('hero_description', 'NIGED-EASE is a powerful inventory management and POS system designed specifically for Ethiopian businesses, supporting multiple languages including Amharic.')}
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ 
                  justifyContent: { xs: 'center', md: 'flex-start' } 
                }}>
                  <Button 
                    component={Link}
                    href="/auth/sign-in"
                    variant="contained" 
                    size="large"
                    sx={{
                      py: 1.2,
                      px: 4,
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                      background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                      '&:hover': {
                        boxShadow: '0 15px 20px -3px rgba(99, 102, 241, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {safeTranslate('get_started', 'Get Started')}
                  </Button>
                  <Button 
                    component={Link}
                    href="/features"
                    variant="outlined" 
                    size="large"
                    endIcon={<ArrowRight />}
                    sx={{
                      py: 1.2,
                      px: 3,
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      borderColor: '#6366F1',
                      color: '#6366F1',
                      '&:hover': {
                        borderColor: '#6366F1',
                        bgcolor: 'rgba(99, 102, 241, 0.04)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {safeTranslate('learn_more', 'Learn More')}
                  </Button>
                </Stack>
              </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      {/* ========================= */}
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            py: { xs: 6, sm: 8, md: 12 },
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            px: { xs: 2, sm: 3, md: 6 },
            my: { xs: 4, md: 6 },
            overflow: 'hidden',
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6, 148, 162, 0.05) 0%, rgba(6, 148, 162, 0) 70%)',
              top: -100,
              right: -100,
              zIndex: 0,
            },
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0) 70%)',
              bottom: -100,
              left: -100,
              zIndex: 0,
            },
            // #6: Move hardcoded box shadow and color to theme or constants (example)
            // boxShadow: theme.shadows[8],
            // background: theme.palette.background.paper,
          }}
        >
          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ position: 'relative', zIndex: 1 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ px: { xs: 1, sm: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1.5,
                  color: 'text.primary',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    background: 'linear-gradient(90deg, #0694A2 0%, #047481 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
              >
                {t('stats_title')}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                    mb: 2,
                    fontSize: '1rem',
                    lineHeight: 1.6,
                }}
              >
                {t('stats_subtitle')}
              </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={{ xs: 3, md: 4 }}>
                {[
                  {
                    value: t('stats_visitors'),
                    label: t('stats_visitors_label'),
                    color: "linear-gradient(180deg, #0694A2 0%, #047481 100%)"
                  },
                  {
                    value: t('stats_users'),
                    label: t('stats_users_label'),
                    color: "linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)"
                  },
                  {
                    value: t('stats_clients'),
                    label: t('stats_clients_label'),
                    color: "linear-gradient(180deg, #16BDCA 0%, #0694A2 100%)"
                  },
                  {
                    value: t('stats_countries'),
                    label: t('stats_countries_label'),
                    color: "linear-gradient(180deg, #A78BFA 0%, #8B5CF6 100%)"
                  }
                ].map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Box 
                      sx={{ 
                        p: 2,
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'rgba(203, 213, 225, 0.3)',
                        background: 'rgba(255, 255, 255, 0.6)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                          background: 'rgba(255, 255, 255, 0.9)',
                        },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                            height: 30, 
                            background: stat.color,
                        borderRadius: 1, 
                            mr: 2,
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Typography 
                      variant="h4" 
                      component="span" 
                      sx={{ 
                            fontWeight: 800, 
                            color: 'text.primary',
                            fontSize: { xs: '1.75rem', md: '2rem' }
                          }}
                        >
                          {stat.value}
                    </Typography>
                  </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                      sx={{ 
                          ml: 4,
                          textAlign: { xs: 'center', md: 'left' }
                        }}
                      >
                        {stat.label}
                    </Typography>
                  </Box>
                </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Testimonials Section */}
      {/* ========================= */}
      <Box sx={{ bgcolor: '#edfafa', py: { xs: 6, sm: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 5 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative', mb: { xs: 2, md: 4 }, px: { xs: 2, sm: 0 } }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '8rem', md: '10rem' }, 
                    color: '#0694A2', 
                    opacity: 0.2, 
                    position: 'absolute', 
                    top: -50, 
                    left: { xs: '50%', md: -20 },
                    transform: { xs: 'translateX(-50%)', md: 'none' },
                    fontFamily: '"Georgia", serif',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  "
                </Typography>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  sx={{ 
                    position: 'relative', 
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                    mb: 2,
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  {t('testimonials_title')}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ textAlign: { xs: 'center', md: 'left' } }}
                >
                  {t('testimonials_subtitle')}
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'white', 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  mb: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      bgcolor: '#0694A2', 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(6, 148, 162, 0.2)',
                    }}
                  >
                    JD
                  </Box>
                  <Box ml={2}>
                    <Typography variant="subtitle1" fontWeight={600}>
                  {t('testimonial1_name')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('testimonial1_position')}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {t('testimonial1_text')}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box 
                  sx={{ 
                    p: { xs: 3, md: 4 }, 
                    bgcolor: 'white', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    mb: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { sm: 'flex-start' },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box sx={{ 
                    minWidth: { xs: '100%', sm: 120 }, 
                    mb: { xs: 2, sm: 0 }, 
                    mr: { sm: 3 },
                    display: 'flex',
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    <Box
                      sx={{ 
                        p: 2,
                        bgcolor: '#f8fafc', 
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: 'rgba(203, 213, 225, 0.5)',
                        textAlign: 'center',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        color: '#0694A2'
                      }}
                    >
                      LogoIpsum
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {t('testimonial2_text')}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%', 
                          bgcolor: '#8B5CF6', 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          mr: 1.5,
                          fontSize: '0.8rem',
                          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
                        }}
                      >
                        AK
                      </Box>
                      <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('testimonial2_name')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('testimonial2_position')}
                    </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                
                <Box 
                  sx={{ 
                    p: { xs: 3, md: 4 }, 
                    bgcolor: 'white', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    mb: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { sm: 'flex-start' },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box sx={{ 
                    minWidth: { xs: '100%', sm: 120 }, 
                    mb: { xs: 2, sm: 0 }, 
                    mr: { sm: 3 },
                    display: 'flex',
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    <Box
                      sx={{ 
                        p: 2,
                        bgcolor: '#f8fafc', 
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: 'rgba(203, 213, 225, 0.5)',
                        textAlign: 'center',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        color: '#0694A2'
                      }}
                    >
                      LOGO
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {t('testimonial3_text')}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '50%', 
                          bgcolor: '#16BDCA', 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          mr: 1.5,
                          fontSize: '0.8rem',
                          boxShadow: '0 4px 12px rgba(22, 189, 202, 0.2)',
                        }}
                      >
                        JD
                      </Box>
                      <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('testimonial3_name')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('testimonial3_position')}
                    </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      {/* ========================= */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 6, sm: 8, md: 12 } }}>
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              fontWeight: 700, 
              mb: { xs: 3, md: 4 },
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
              background: 'linear-gradient(90deg, #0694A2 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              px: { xs: 2, sm: 0 }
            }}
          >
            {t('features_section_title')}
          </Typography>
          
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              mb: { xs: 5, md: 8 }, 
              color: 'text.secondary',
              px: { xs: 2, sm: 4, md: 0 }
            }}
          >
            {t('features_section_subtitle')}
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {[
              {
                icon: "inventory_management",
                title: t('feature1_title'),
                description: t('feature1_description')
              },
              {
                icon: "reporting",
                title: t('feature2_title'),
                description: t('feature2_description')
              },
              {
                icon: "chatbot",
                title: t('feature3_title'),
                description: t('feature3_description')
              },
              {
                icon: "accounting",
                title: t('feature4_title'),
                description: t('feature4_description')
              },
              {
                icon: "prediction",
                title: t('feature5_title'),
                description: t('feature5_description')
              },
              {
                icon: "financing",
                title: t('feature6_title'),
                description: t('feature6_description')
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box 
                  sx={{ 
                    p: { xs: 2.5, md: 3.5 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    border: '1px solid rgba(203, 213, 225, 0.3)',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.06)',
                      borderColor: index % 2 === 0 ? 'rgba(6, 148, 162, 0.3)' : 'rgba(139, 92, 246, 0.3)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2.5
                    }}
                  >
                    <Box 
                      sx={{ 
                        minWidth: 40,
                        height: 40,
                        bgcolor: index % 2 === 0 ? 'rgba(6, 148, 162, 0.1)' : 'rgba(139, 92, 246, 0.1)', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        '& svg': {
                          color: index % 2 === 0 ? '#0694A2' : '#8B5CF6'
                        }
                      }} 
                    >
                      {index === 0 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M237.66,133.66l-12.12,64A16,16,0,0,1,210,212H46a16,16,0,0,1-15.52-14.34l-12.12-64a16,16,0,0,1,13-18.57L173.39,82A16,16,0,0,1,192,95.06V200h16V95.06a32.06,32.06,0,0,0-37.22-26.14L28.73,102a32,32,0,0,0-26.1,37.14l12.12,64A32,32,0,0,0,46,228H210a32,32,0,0,0,31.24-27.68l12.12-64a32,32,0,0,0-24.3-37.49L212,93.94A4,4,0,0,0,207.31,97a4,4,0,0,0,3.06,4.68l17.07,4.9a24,24,0,0,1,10.22,6.13,23.82,23.82,0,0,1,7.2,21Z"></path>
                        </svg>
                      )}
                      {index === 1 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M236,144a8,8,0,0,1-8,8H224a40,40,0,0,1-8,19.31V192a8,8,0,0,1-16,0V184a39.48,39.48,0,0,1-16,0v8a8,8,0,0,1-16,0V171.31a39.87,39.87,0,0,1-8-35.31h-8a40,40,0,0,1-8,19.31V192a8,8,0,0,1-16,0V184a39.48,39.48,0,0,1-16,0v8a8,8,0,0,1-16,0V171.31A40,40,0,0,1,48,128H28a8,8,0,0,1,0-16H48a40,40,0,0,1,48-32,40,40,0,0,1,64,0,40,40,0,0,1,48,32h20A8,8,0,0,1,236,144ZM96,120a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,120Zm88,48a24,24,0,1,0-24,24A24,24,0,0,0,184,168Zm-88,0a24,24,0,1,0-24,24A24,24,0,0,0,96,168Z"></path>
                        </svg>
                      )}
                      {index === 2 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M80,128a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,128Zm8,40h80a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16Zm136-88V184a32,32,0,0,1-32,32H64a32,32,0,0,1-32-32V80A32,32,0,0,1,64,48H88a8,8,0,0,1,0,16H64a16,16,0,0,0-16,16V184a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H168a8,8,0,0,1,0-16h24A32,32,0,0,1,224,80ZM152,24a32,32,0,0,0-48,0,8,8,0,0,0,12,10.58,16,16,0,0,1,24,0A8,8,0,1,0,152,24Z"></path>
                        </svg>
                      )}
                      {index === 3 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M24,128a104,104,0,0,1,208,0c0,34.34-9.82,55.49-19.38,68a8,8,0,0,1-6.62,3H50a8,8,0,0,1-6.62-3C33.82,183.49,24,162.34,24,128Zm200-8h-76.4a16,16,0,0,1,0,16H224A88.33,88.33,0,0,0,128,40V96.4a16,16,0,0,1,16,0V40A88.33,88.33,0,0,0,32,120h76.4a16,16,0,0,1,0-16H32A88.13,88.13,0,0,0,41.89,183.92H214.11A88.13,88.13,0,0,0,224,120Zm-48,8a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v0a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8ZM50,216a6,6,0,0,0,6,6H200a6,6,0,0,0,6-6v-5H50Z"></path>
                        </svg>
                      )}
                      {index === 4 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M207.06,80.67A111.24,111.24,0,0,0,128,48h-.4C66.07,48.21,16,99,16,161.13V184a8,8,0,0,0,8,8H232a8,8,0,0,0,8-8V161.13a114.23,114.23,0,0,0-32.94-80.46ZM32,176V161.13C32,107.92,75.09,64.2,127.73,64h.53a95.6,95.6,0,0,1,67.07,28.21A97.22,97.22,0,0,1,224,161.13V176Zm80-24a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16h32A8,8,0,0,1,112,152Zm64-16a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16h96A8,8,0,0,1,176,136Zm0-32a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16h64A8,8,0,0,1,176,104Z"></path>
                        </svg>
                      )}
                      {index === 5 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V88H40V56Zm0,144H40V104H216v96Zm-40-24a8,8,0,0,1,0,16H136a8,8,0,0,1,0-16Z"></path>
                        </svg>
                      )}
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1.125rem', md: '1.25rem' },
                        color: index % 2 === 0 ? '#0694A2' : '#8B5CF6'
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Screenshot Section */}
      {/* ========================= */}
      <Box sx={{ bgcolor: '#0694A2', py: { xs: 6, sm: 8, md: 12 }, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box sx={{ px: { xs: 2, sm: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                }}
              >
                {t('screenshot_title')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                {t('screenshot_subtitle')}
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  bgcolor: 'white', 
                    color: '#0694A2',
                    borderRadius: '10px',
                    px: { xs: 3, md: 4 },
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.2s',
                  '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(255, 255, 255, 0.3)',
                  }
                }}
                  component={Link}
                  href={paths.auth.signIn}
              >
                {t('get_started')}
              </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box 
                component="img"
                src="/assets/dashboard-preview.png"
                alt="System Screenshot"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  mt: { xs: 2, md: 0 }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Add Chatbot component */}
      <Chatbot />

      {/* Footer */}
      {/* ========================= */}
      <Box sx={{ 
        bgcolor: '#f8fafc', 
        borderTop: '3px solid #0694A2',
        py: { xs: 4, md: 6 }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* Logo Section - Left */}
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box 
                component="img"
                src="/assets/Neged.png"
                alt="NIGED-EASE Logo"
                role="img"
                aria-label="NIGED-EASE Logo"
                sx={{
                  width: { xs: 150, sm: 200 },
                  height: 'auto',
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  padding: '10px',
                  border: '2px solid #0694A2',
                  boxShadow: '0 6px 16px rgba(6, 148, 162, 0.15)',
                  objectFit: 'contain',
                  mb: { xs: 2, md: 0 }
                }}
              />
            </Grid>
            
            {/* Navigation Links - Middle */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2, 
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#0694A2' }}>
                  {t('quick_links')}
                </Typography>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography 
                    variant="body1" 
                    fontWeight={500}
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateX(5px)'
                      },
                      display: 'inline-block'
                    }}
                  >
                    {safeTranslate('home', 'Home')}
                  </Typography>
                </Link>
                <Link href="/features" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography 
                    variant="body1" 
                    fontWeight={500}
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateX(5px)'
                      },
                      display: 'inline-block'
                    }}
                  >
                    {safeTranslate('features', 'Features')}
                  </Typography>
                </Link>
                <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography 
                    variant="body1" 
                    fontWeight={500}
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateX(5px)'
                      },
                      display: 'inline-block'
                    }}
                  >
                    {t('contact')}
                  </Typography>
                </Link>
              </Box>
            </Grid>
            
            {/* Contact Information - Right */}
            <Grid item xs={12} sm={6} md={4} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#0694A2' }}>
                {t('contact_us')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {t('contact_email')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {t('contact_phone')}
              </Typography>
              
              {/* Social Icons */}
              <Stack 
                direction="row" 
                spacing={3} 
                sx={{ 
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  mb: { xs: 2, md: 0 }
                }}
              >
                <IconButton 
                  href="#" 
                  aria-label="Facebook" 
                  sx={{ 
                    color: '#1877F2',
                    bgcolor: 'rgba(24, 119, 242, 0.1)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(24, 119, 242, 0.2)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <FacebookLogo size={20} weight="fill" />
                </IconButton>
                <IconButton 
                  href="#" 
                  aria-label="Instagram" 
                  sx={{ 
                    color: '#E4405F',
                    bgcolor: 'rgba(228, 64, 95, 0.1)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(228, 64, 95, 0.2)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <InstagramLogo size={20} weight="fill" />
                </IconButton>
                <IconButton 
                  href="#" 
                  aria-label="Telegram" 
                  sx={{ 
                    color: '#0088cc',
                    bgcolor: 'rgba(0, 136, 204, 0.1)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(0, 136, 204, 0.2)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <TelegramLogo size={20} weight="fill" />
                </IconButton>
                <IconButton 
                  href="#" 
                  aria-label="LinkedIn" 
                  sx={{ 
                    color: '#0A66C2',
                    bgcolor: 'rgba(10, 102, 194, 0.1)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(10, 102, 194, 0.2)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <LinkedinLogo size={20} weight="fill" />
                </IconButton>
                <IconButton 
                  href="#" 
                  aria-label="Twitter" 
                  sx={{ 
                    color: '#1DA1F2',
                    bgcolor: 'rgba(29, 161, 242, 0.1)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(29, 161, 242, 0.2)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <TwitterLogo size={20} weight="fill" />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
          
          {/* Copyright Section */}
          <Box 
            sx={{ 
              mt: { xs: 4, md: 6 }, 
              pt: 3, 
              borderTop: '1px solid', 
              borderColor: 'rgba(203, 213, 225, 0.5)',
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {t('copyright')}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
