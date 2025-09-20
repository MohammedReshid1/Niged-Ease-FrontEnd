'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Buildings as BuildingsIcon } from '@phosphor-icons/react/dist/ssr/Buildings';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

export default function PartiesPage(): React.JSX.Element {
  // Parties section cards
  const sections = [
    {
      id: 'customers',
      title: 'Customers',
      description: 'Manage all your customers and their information',
      icon: <UsersIcon size={52} weight="bold" />,
      color: '#0ea5e9',
      link: '/admin/parties/customers',
    },
    {
      id: 'suppliers',
      title: 'Suppliers',
      description: 'Manage all your suppliers and their information',
      icon: <BuildingsIcon size={52} weight="bold" />,
      color: '#0ea5e9',
      link: '/admin/parties/suppliers',
    },
    {
      id: 'receivables',
      title: 'Receivables',
      description: 'Track and manage all your customer receivables',
      icon: <UsersIcon size={52} weight="bold" />,
      color: '#0ea5e9',
      link: '/admin/parties/receivables',
    },
    {
      id: 'payables',
      title: 'Payables',
      description: 'Track and manage all your supplier payables',
      icon: <BuildingsIcon size={52} weight="bold" />,
      color: '#0ea5e9',
      link: '/admin/parties/payables',
    },
  ];

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: '/admin/dashboard' },
    { label: 'Parties', url: '/admin/parties' },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Parties
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <Box component="span" sx={{ mx: 0.5 }}>
                  -
                </Box>
              )}
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
          <Grid item xs={12} sm={6} md={6} key={section.id}>
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
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    bgcolor: 'rgba(14, 165, 233, 0.1)',
                  }}
                >
                  <Box sx={{ color: section.color }}>{section.icon}</Box>
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
