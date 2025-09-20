'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Bank as BankIcon } from '@phosphor-icons/react/dist/ssr/Bank';
import Link from 'next/link';
import { paths } from '@/paths';

export default function ReportsPage(): React.JSX.Element {
  // Reports section cards
  const sections = [
    {
      id: 'payments',
      title: 'Payments Reports',
      description: 'View payment records and generate payment reports',
      icon: <CreditCardIcon size={52} weight="bold" />,
      color: '#0ea5e9',
      link: paths.stockManager.paymentReports,
    },
    {
      id: 'users',
      title: 'Users Reports',
      description: 'View user balances and transaction data',
      icon: <UsersIcon size={52} weight="bold" />,
      color: '#0ea5e9',
      link: paths.stockManager.userReports,
    },
    {
      id: 'expenses',
      title: 'Expense Reports',
      description: 'View expense records and analyze spending',
      icon: <BankIcon size={52} weight="bold" />,
      color: '#0ea5e9',
      link: paths.stockManager.expenseReports,
    },
  ];

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.stockManager.dashboard },
    { label: 'Reports', url: paths.stockManager.reports },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Reports</Typography>
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