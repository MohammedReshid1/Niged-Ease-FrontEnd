'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Building, ChartBar, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';

// Dynamically import the LanguageSwitcher with SSR disabled to prevent hydration errors
const LanguageSwitcher = dynamic(
  () => import('@/components/core/language-switcher').then(mod => mod.LanguageSwitcher),
  { ssr: false }
);

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  const { t } = useTranslation('auth');
  
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
        position: 'relative',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* Background Gradient Elements for Visual Interest */}
      <Box 
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(79, 70, 229, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      <Box 
        sx={{ 
          display: 'flex', 
          flex: '1 1 auto', 
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo Area with Animation */}
        <Box 
          sx={{ 
            p: { xs: 2, sm: 4 }, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'fadeInDown 0.6s ease-out',
            '@keyframes fadeInDown': {
              from: {
                opacity: 0,
                transform: 'translateY(-20px)'
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <Box 
            component={RouterLink} 
            href={paths.home} 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Box 
              component="img"
              src="/assets/Neged.png"
              alt="NIGED-EASE Logo"
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                mr: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}
            />
            <Typography 
              variant="h5" 
              component="span" 
              color="text.primary" 
              sx={{ 
                fontWeight: 700, 
                letterSpacing: 0.5,
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
          
          <LanguageSwitcher />
        </Box>

        {/* Form Container with Animation */}
        <Box 
          sx={{ 
            alignItems: 'center', 
            display: 'flex', 
            flex: '1 1 auto', 
            justifyContent: 'center', 
            p: { xs: 2, sm: 4 },
            animation: 'fadeIn 0.8s ease-out',
            '@keyframes fadeIn': {
              from: {
                opacity: 0
              },
              to: {
                opacity: 1
              }
            }
          }}
        >
          <Box 
            sx={{ 
              maxWidth: '450px', 
              width: '100%',
              p: { xs: 3, sm: 4 },
              bgcolor: 'background.paper',
              borderRadius: '16px',
              boxShadow: '0 10px 50px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              zIndex: 2,
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                transform: 'translateY(-4px)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
              }
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>

      {/* Right Side Illustration with Modern Design and Animation */}
      <Box
        sx={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 8,
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeInRight 1s ease-out',
          '@keyframes fadeInRight': {
            from: {
              opacity: 0,
              transform: 'translateX(40px)'
            },
            to: {
              opacity: 1,
              transform: 'translateX(0)'
            }
          }
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, rgba(20, 184, 166, 0) 70%)',
            filter: 'blur(40px)',
            animation: 'pulse 8s infinite alternate ease-in-out',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 0.7 },
              '100%': { transform: 'scale(1.2)', opacity: 0.5 }
            }
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%)',
            filter: 'blur(40px)',
            animation: 'pulse 8s infinite alternate-reverse ease-in-out',
          }}
        />

        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            background: 'url("/assets/grid-pattern.svg")',
            zIndex: 0,
            animation: 'pan 60s infinite linear',
            '@keyframes pan': {
              '0%': { backgroundPosition: '0% 0%' },
              '100%': { backgroundPosition: '100% 100%' }
            }
          }}
        />

        <Stack spacing={8} sx={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <Stack spacing={3}>
            <Typography 
              color="inherit" 
              sx={{ 
                fontSize: { lg: '36px', xl: '40px' }, 
                lineHeight: 1.2, 
                fontWeight: 800,
                textAlign: 'center',
                animation: 'fadeIn 1s ease-out 0.3s both',
              }} 
              variant="h1"
            >
              <Box 
                component="img"
                src="/assets/Neged.png"
                alt="NIGED-EASE Logo"
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: '20%',
                  border: '4px solid rgba(255, 255, 255, 0.1)',
                  padding: 1,
                  display: 'block',
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: 'white',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                  animation: 'float 6s infinite ease-in-out',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                  }
                }}
              />
              {t('business_management')}{' '}
              <Box component="span" sx={{ 
                background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
              }}>
                {t('app_name')}
              </Box>
            </Typography>
            <Typography 
              align="center" 
              variant="h6"
              sx={{ 
                opacity: 0.9,
                fontWeight: 400,
                maxWidth: '90%',
                mx: 'auto',
                lineHeight: 1.6,
                animation: 'fadeIn 1s ease-out 0.6s both',
              }}
            >
              {t('business_subtitle')}
            </Typography>
          </Stack>

          <Stack spacing={4}>
            {[
              {
                icon: <Building size={36} weight="fill" />,
                title: t('feature_business_title'),
                description: t('feature_business_desc')
              },
              {
                icon: <ShieldCheck size={36} weight="fill" />,
                title: t('feature_secure_title'),
                description: t('feature_secure_desc')
              },
              {
                icon: <ChartBar size={36} weight="fill" />,
                title: t('feature_analytics_title'),
                description: t('feature_analytics_desc')
              }
            ].map((feature, index) => (
              <Box 
                key={index}
                sx={{
                  display: 'flex',
                  p: 3,
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  animation: `fadeInUp 0.8s ease-out ${0.3 + index * 0.2}s both`,
                  '@keyframes fadeInUp': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(20px)'
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  },
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  }
                }}
              >
                <Box 
                  sx={{ 
                    mr: 3,
                    color: index === 0 ? '#14B8A6' : index === 1 ? '#6366F1' : '#8B5CF6',
                    display: 'flex',
                    alignItems: 'flex-start',
                    pt: 0.5,
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600, letterSpacing: 0.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
