'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShoppingCart, 
  Package, 
  ChartBar, 
  Gear, 
  Users, 
  Briefcase,
  Receipt,
  Calculator,
  UsersThree,
  CloudArrowUp,
  FacebookLogo,
  InstagramLogo,
  TelegramLogo,
  LinkedinLogo,
  TwitterLogo,
  SnapchatLogo
} from '@phosphor-icons/react/dist/ssr';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';

// Dynamically import the LanguageSwitcher with SSR disabled to prevent hydration errors
const LanguageSwitcher = dynamic(
  () => import('@/components/core/language-switcher').then(mod => mod.LanguageSwitcher),
  { ssr: false }
);

export default function FeaturesPage(): React.JSX.Element {
  const { t, i18n } = useTranslation('features');
  
  // Helper function to safely get translations with fallbacks
  const safeTranslate = (key: string, fallback: string): string => {
    const result = t(key);
    // If the result is the same as the key, it means translation failed
    return result === key ? fallback : result;
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
                  {t('app_name')}
                </Typography>
              </Link>
              <Box sx={{ 
                display: 'flex', 
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
                {t('home')}
              </Typography>
            </Link>
            <Link href="/features" style={{ textDecoration: 'none' }}>
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
                {t('features')}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
        </Box>
      </Container>
      </Box>

      {/* Hero Section */}
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
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                lineHeight: 1.2,
                mb: 3,
                background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 10px 30px rgba(99, 102, 241, 0.1)',
              }}
            >
              {t('hero_title')}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary', 
                mb: 5,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
                maxWidth: '85%',
                mx: 'auto',
                opacity: 0.9,
              }}
            >
              {t('hero_subtitle')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2.5, 
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
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
                  boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                  transform: 'translateY(-2px)',
                  '&::before': {
                    left: '100%',
                  }
                }
              }}
              component={Link}
              href={paths.auth.signIn}
            >
              {t('get_started')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ 
          py: { xs: 8, md: 12 },
          position: 'relative',
          zIndex: 1, 
        }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('core_features_title')}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              maxWidth: 700,
              mx: 'auto',
              mb: 8,
              color: 'text.secondary',
              fontSize: '1.1rem'
            }}
          >
            {t('core_features_subtitle')}
          </Typography>
          
          <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mt: 2 }}>
            {[
              {
                icon: <ShoppingCart size={44} weight="duotone" />,
                title: t('feature1_title'),
                description: t('feature1_description'),
                gradient: "linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%)",
                iconColor: "#14B8A6"
              },
              {
                icon: <Package size={44} weight="duotone" />,
                title: t('feature2_title'),
                description: t('feature2_description'),
                gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                iconColor: "#6366F1"
              },
              {
                icon: <ChartBar size={44} weight="duotone" />,
                title: t('feature3_title'),
                description: t('feature3_description'),
                gradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(251, 113, 133, 0.1) 100%)",
                iconColor: "#F43F5E"
              },
              {
                icon: <Users size={44} weight="duotone" />,
                title: t('feature4_title'),
                description: t('feature4_description'),
                gradient: "linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(253, 186, 116, 0.1) 100%)",
                iconColor: "#EAB308"
              },
              {
                icon: <Receipt size={44} weight="duotone" />,
                title: t('feature5_title'),
                description: t('feature5_description'),
                gradient: "linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                iconColor: "#0891B2"
              },
              {
                icon: <Briefcase size={44} weight="duotone" />,
                title: t('feature6_title'),
                description: t('feature6_description'),
                gradient: "linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                iconColor: "#10B981"
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Box 
                  sx={{ 
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: `fadeInUp 0.6s ${index * 0.1}s both ease-out`,
                    '@keyframes fadeInUp': {
                      from: { 
                        opacity: 0,
                        transform: 'translateY(30px)'
                      },
                      to: { 
                        opacity: 1,
                        transform: 'translateY(0)'
                      }
                    },
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: feature.gradient,
                      opacity: 0.7,
                      zIndex: 0,
                      transition: 'opacity 0.3s ease',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}
                  >
                    <Box 
                      sx={{ 
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '24px',
                        background: 'white',
                        boxShadow: `0 10px 20px rgba(0,0,0,0.06)`,
                        color: feature.iconColor,
                        mx: 'auto'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 2, 
                        textAlign: 'center',
                        fontWeight: 600,
                        color: 'text.primary'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        flex: 1,
                        color: 'text.secondary',
                        textAlign: 'center',
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      
      {/* Business Types Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 50%, #f0fdf4 100%)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              background: 'linear-gradient(90deg, #14B8A6 0%, #10B981 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('business_types_title')}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              maxWidth: 700,
              mx: 'auto',
              mb: 8,
              color: 'text.secondary',
              fontSize: '1.1rem'
            }}
          >
            {t('business_types_subtitle')}
          </Typography>
          
          <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 6 }}>
            {[
              {
                icon: <ShoppingCart size={38} weight="duotone" />,
                title: t('retail_title'),
                description: t('retail_description'),
                color: "#14B8A6"
              },
              {
                icon: <Package size={38} weight="duotone" />,
                title: t('wholesale_title'),
                description: t('wholesale_description'),
                color: "#6366F1"
              },
              {
                icon: <Briefcase size={38} weight="duotone" />,
                title: t('service_title'),
                description: t('service_description'),
                color: "#F43F5E"
              },
              {
                icon: <Gear size={38} weight="duotone" />,
                title: t('manufacturing_title'),
                description: t('manufacturing_description'),
                color: "#EAB308"
              }
            ].map((business, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box 
                  sx={{ 
                    p: 4,
                    display: 'flex',
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      mr: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '16px',
                      background: 'white',
                      boxShadow: `0 8px 16px rgba(0,0,0,0.06)`,
                      color: business.color,
                      flexShrink: 0
                    }}
                  >
                    {business.icon}
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600,
                        color: 'text.primary'
                      }}
                    >
                      {business.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6
                      }}
                    >
                      {business.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box 
            sx={{ 
              textAlign: 'center',
              mt: 8
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4,
                maxWidth: 800,
                mx: 'auto',
                color: 'text.primary',
                fontWeight: 500
              }}
            >
              {t('join_businesses')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2.5, 
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(90deg, #14B8A6 0%, #10B981 100%)',
                boxShadow: '0 8px 16px rgba(20, 184, 166, 0.25)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 10px 20px rgba(20, 184, 166, 0.35)',
                  transform: 'translateY(-2px)',
                }
              }}
              component={Link}
              href={paths.auth.signIn}
            >
              {t('try_free_button')}
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: '#f8fafc',
          py: 8,
          borderTop: '1px solid',
          borderColor: 'rgba(203, 213, 225, 0.5)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box 
                  component="img"
                  src="/assets/Neged.png"
                  alt="NIGED-EASE Logo"
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 1.5,
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    padding: '6px',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(203, 213, 225, 0.3)',
                    objectFit: 'contain',
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
                  {t('app_name')}
                </Typography>
              </Box>
              <Stack spacing={3} direction="row" sx={{ mb: 4 }}>
                <IconButton sx={{ color: '#1877F2' }}>
                  <FacebookLogo size={24} weight="fill" />
                </IconButton>
                <IconButton sx={{ color: '#E4405F' }}>
                  <InstagramLogo size={24} weight="fill" />
                </IconButton>
                <IconButton sx={{ color: '#229ED9' }}>
                  <TelegramLogo size={24} weight="fill" />
                </IconButton>
                <IconButton sx={{ color: '#0A66C2' }}>
                  <LinkedinLogo size={24} weight="fill" />
                </IconButton>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#0694A2' }}>
                {t('quick_links')}
              </Typography>
              <Stack spacing={2}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography 
                    variant="body1" 
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateX(5px)'
                      },
                      display: 'inline-block'
                    }}
                  >
                    {t('home')}
                  </Typography>
                </Link>
                <Link href="/features" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography 
                    variant="body1" 
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateX(5px)'
                      },
                      display: 'inline-block'
                    }}
                  >
                    {t('features')}
                  </Typography>
                </Link>
                <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography 
                    variant="body1" 
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
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#0694A2' }}>
                {t('contact_us')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {t('contact_email')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {t('contact_phone')}
              </Typography>
            </Grid>
          </Grid>
          
          <Box 
            sx={{ 
              mt: 6, 
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