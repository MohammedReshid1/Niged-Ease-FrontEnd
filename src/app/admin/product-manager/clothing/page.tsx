'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Palette as ColorIcon } from '@phosphor-icons/react/dist/ssr/Palette';
import { SunHorizon as SeasonIcon } from '@phosphor-icons/react/dist/ssr/SunHorizon';
import { Tote as CollectionIcon } from '@phosphor-icons/react/dist/ssr/Tote';
import { Ruler as SizeIcon } from '@phosphor-icons/react/dist/ssr/Ruler';
import { TShirt as MaterialIcon } from '@phosphor-icons/react/dist/ssr/TShirt';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { clothingsApi } from '@/services/api/clothings';
import { companiesApi } from '@/services/api/companies';
import { useSnackbar } from 'notistack';
import { useCurrentUser } from '@/hooks/use-auth';

interface PageHeadingProps {
  title: string;
  actions?: React.ReactNode;
}

function PageHeading({ title, actions }: PageHeadingProps): React.JSX.Element {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={4}
    >
      <div>
        <Typography variant="h4">
          {title}
        </Typography>
      </div>
      {actions && (
        <div>
          {actions}
        </div>
      )}
    </Stack>
  );
}

export default function ClothingPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = useCurrentUser();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentStoreId, setCurrentStoreId] = React.useState<string>('');
  const [counts, setCounts] = React.useState({
    colors: 0,
    seasons: 0,
    collections: 0
  });

  // First get the store id
  React.useEffect(() => {
    const fetchStoreId = async () => {
      try {
        // Get companies to find the user's company
        const companiesData = await companiesApi.getCompanies();
        const companyId = userInfo?.company_id || (companiesData.length > 0 ? companiesData[0].id : '');
        
        if (!companyId) {
          enqueueSnackbar('No company information found', { variant: 'error' });
          return;
        }
        
        // Get stores for the company
        const stores = await companiesApi.getStores(companyId);
        
        if (stores.length > 0) {
          const storeId = stores[0].id;
          setCurrentStoreId(storeId);
        } else {
          enqueueSnackbar('No stores found for your company', { variant: 'warning' });
        }
      } catch (error) {
        console.error('Error fetching store ID:', error);
        enqueueSnackbar('Failed to load store information', { variant: 'error' });
      }
    };

    fetchStoreId();
  }, [enqueueSnackbar, userInfo]);

  // Then fetch clothing data when we have the store id
  React.useEffect(() => {
    const fetchCounts = async () => {
      if (!currentStoreId) return;
      
      setIsLoading(true);
      try {
        const [colors, seasons, collections] = await Promise.all([
          clothingsApi.getColors(currentStoreId),
          clothingsApi.getSeasons(currentStoreId),
          clothingsApi.getCollections(currentStoreId)
        ]);

        setCounts({
          colors: colors.length,
          seasons: seasons.length,
          collections: collections.length
        });
      } catch (error) {
        console.error('Error fetching clothing attributes:', error);
        enqueueSnackbar('Failed to load clothing attributes', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentStoreId) {
      fetchCounts();
    }
  }, [currentStoreId, enqueueSnackbar]);

  const clothingAttributes = [
    {
      title: t('clothing.colors.title'),
      description: t('clothing.colors.description'),
      icon: <ColorIcon size={32} />,
      href: paths.admin.clothingColors,
      count: counts.colors,
    },
    {
      title: t('clothing.seasons.title'),
      description: t('clothing.seasons.description'),
      icon: <SeasonIcon size={32} />,
      href: paths.admin.clothingSeasons,
      count: counts.seasons,
    },
    {
      title: t('clothing.collections.title'),
      description: t('clothing.collections.description'),
      icon: <CollectionIcon size={32} />,
      href: paths.admin.clothingCollections,
      count: counts.collections,
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <PageHeading title={t('clothing.title')} />
          
          {!currentStoreId ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>{t('clothing.loading_store')}</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {clothingAttributes.map((attribute) => (
                <Grid item xs={12} sm={6} md={4} key={attribute.title}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                      },
                      boxShadow: 2,
                      borderRadius: 2,
                    }}
                    onClick={() => router.push(attribute.href)}
                  >
                    <CardHeader
                      avatar={
                        <Box
                          sx={{
                            alignItems: 'center',
                            backgroundColor: 'primary.lightest',
                            borderRadius: 2,
                            color: 'primary.main',
                            display: 'flex',
                            height: 48,
                            justifyContent: 'center',
                            width: 48,
                          }}
                        >
                          {attribute.icon}
                        </Box>
                      }
                      title={
                        <Typography variant="h6" component="div">
                          {attribute.title}
                        </Typography>
                      }
                      action={
                        isLoading ? (
                          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                            <CircularProgress size={24} />
                          </Box>
                        ) : (
                          <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                              backgroundColor: 'primary.lightest',
                              borderRadius: '50%',
                              color: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 32,
                              height: 32,
                              fontWeight: 600,
                              mr: 1
                            }}
                          >
                            {attribute.count}
                          </Typography>
                        )
                      }
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {attribute.description}
                      </Typography>
                      <Button
                        color="primary"
                        size="small"
                        variant="text"
                        endIcon={<ArrowRightIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(attribute.href);
                        }}
                      >
                        {t('clothing.colors.manage')}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
} 