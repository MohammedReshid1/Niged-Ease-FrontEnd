'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { TShirt as TShirtIcon } from '@phosphor-icons/react/dist/ssr/TShirt';
import { Palette as PaletteIcon } from '@phosphor-icons/react/dist/ssr/Palette';
import { Ruler as RulerIcon } from '@phosphor-icons/react/dist/ssr/Ruler';
import Link from 'next/link';
import { paths } from '@/paths';

export default function ClothingsPage(): React.JSX.Element {
  // Clothings section cards
  const sections = [
    {
      id: 'colors',
      title: 'Colors',
      description: 'Manage clothing color options for your products',
      icon: <PaletteIcon size={52} weight="bold" />,
      color: '#0ea5e9',
      link: paths.admin.clothingColors,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Manage clothing size options and dimensions',
      icon: <RulerIcon size={52} weight="bold" />,
      color: '#0ea5e9',
      link: paths.admin.clothingSizes,
    },
    {
      id: 'materials',
      title: 'Materials',
      description: 'Manage fabric and material options for clothing',
      icon: <TShirtIcon size={52} weight="bold" />,
      color: '#0ea5e9',
      link: paths.admin.clothingMaterials,
    },
  ];

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Product Manager', url: paths.admin.productManager },
    { label: 'Clothings', url: paths.admin.clothing },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Clothing Management</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Box component="span" sx={{ mx: 0.5 }}>-</Box>}
              <Typography 
                component="a" 
                href={item.url} 
                variant="body2" 
                color={index === breadcrumbItems.length - 1 ? 'text.primary' : 'inherit'}
                sx={{ textDecoration: 'none' }}
              >
                {item.label}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Section Cards */}
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.id}>
            <Link href={section.link} style={{ textDecoration: 'none' }}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    justifyContent: 'center',
                    bgcolor: 'rgba(14, 165, 233, 0.1)'
                  }}
                >
                  <Box sx={{ color: section.color }}>
                    {section.icon}
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 