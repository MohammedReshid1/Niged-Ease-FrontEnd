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
import { useTranslation } from 'react-i18next';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Tag as CategoryIcon } from '@phosphor-icons/react/dist/ssr/Tag';
import { Ruler as UnitIcon } from '@phosphor-icons/react/dist/ssr/Ruler';
import { ShoppingBag as ProductIcon } from '@phosphor-icons/react/dist/ssr/ShoppingBag';
import { TShirt as ClothingIcon } from '@phosphor-icons/react/dist/ssr/TShirt';

import { paths } from '@/paths';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

function PageHeading({ title, subtitle, actions }: PageHeadingProps): React.JSX.Element {
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
        {subtitle && (
          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
            variant="body1"
          >
            {subtitle}
          </Typography>
        )}
      </div>
      {actions && (
        <div>
          {actions}
        </div>
      )}
    </Stack>
  );
}

export default function ProductManagerPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const router = useRouter();

  const productManagementOptions = [
    {
      title: t('nav.categories'),
      description: t('categories.all_categories'),
      icon: <CategoryIcon size={32} />,
      href: paths.admin.categories,
    },
    {
      title: t('nav.product_units'),
      description: t('product_units.all_units'),
      icon: <UnitIcon size={32} />,
      href: paths.admin.productUnits,
    },
    {
      title: t('nav.products'),
      description: t('products.all_products'),
      icon: <ProductIcon size={32} />,
      href: paths.admin.products,
    },
    {
      title: t('nav.clothing'),
      description: t('clothing.subtitle'),
      icon: <ClothingIcon size={32} />,
      href: paths.admin.clothing,
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <PageHeading 
            title={t('product_manager.title')} 
            subtitle={t('product_manager.subtitle')} 
          />
          
          <Grid container spacing={3}>
            {productManagementOptions.map((option) => (
              <Grid item xs={12} sm={6} md={3} key={option.title}>
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
                  onClick={() => router.push(option.href)}
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
                        {option.icon}
                      </Box>
                    }
                    title={
                      <Typography variant="h6">
                        {option.title}
                      </Typography>
                    }
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {option.description}
                    </Typography>
                    <Button
                      color="primary"
                      size="small"
                      variant="text"
                      endIcon={<ArrowRightIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(option.href);
                      }}
                    >
                      {t('common.view')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
} 