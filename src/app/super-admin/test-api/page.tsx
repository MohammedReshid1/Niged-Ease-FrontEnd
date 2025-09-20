'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Stack, 
  Typography, 
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { authApi } from '@/services/api/auth';
import { companiesApi } from '@/services/api/companies';
import tokenStorage from '@/utils/token-storage';

// Test API Component
export default function TestApiPage() {
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in storage
        const token = tokenStorage.getAccessToken();
        if (!token) {
          setAuthStatus('unauthenticated');
          return;
        }
        
        // Verify token is valid
        const isAuthenticated = await authApi.checkAuth();
        if (isAuthenticated) {
          setAuthStatus('authenticated');
          // Get user profile
          const profile = await authApi.getProfile();
          setUserInfo(profile);
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthStatus('unauthenticated');
      }
    };
    
    checkAuth();
  }, []);

  // Load companies data
  const loadCompaniesData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data from companies API
      const [companiesData, currenciesData, plansData] = await Promise.all([
        companiesApi.getCompanies(),
        companiesApi.getCurrencies(),
        companiesApi.getSubscriptionPlans()
      ]);
      
      setCompanies(companiesData);
      setCurrencies(currenciesData);
      setSubscriptionPlans(plansData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authApi.logout();
      setAuthStatus('unauthenticated');
      setUserInfo(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4">API Integration Test</Typography>
          
          {/* Authentication Status */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Authentication Status</Typography>
              {authStatus === 'checking' ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <CircularProgress size={20} />
                  <Typography>Checking authentication...</Typography>
                </Box>
              ) : authStatus === 'authenticated' ? (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Authenticated successfully
                  </Alert>
                  {userInfo && (
                    <Box>
                      <Typography><strong>User ID:</strong> {userInfo.id}</Typography>
                      <Typography><strong>Email:</strong> {userInfo.email}</Typography>
                      <Typography><strong>Role:</strong> {userInfo.role}</Typography>
                      {userInfo.first_name && (
                        <Typography><strong>Name:</strong> {userInfo.first_name} {userInfo.last_name}</Typography>
                      )}
                      
                      <Button 
                        variant="outlined" 
                        color="error" 
                        sx={{ mt: 2 }} 
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                <Alert severity="warning">
                  Not authenticated. Please log in to test the API.
                </Alert>
              )}
            </CardContent>
          </Card>
          
          {/* Companies API Test */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Companies API Test</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Test your integration with the NIGED-EASE core service API by loading companies data.
              </Typography>
              
              <Button 
                variant="contained" 
                onClick={loadCompaniesData} 
                disabled={loading || authStatus !== 'authenticated'}
                sx={{ mb: 3 }}
              >
                {loading ? 'Loading...' : 'Load Companies Data'}
              </Button>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {/* Companies */}
              {companies.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Companies ({companies.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {companies.map((company) => (
                    <Box key={company.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <Typography variant="subtitle2">{company.name}</Typography>
                      <Typography variant="body2">Short Name: {company.short_name}</Typography>
                      <Typography variant="body2">Address: {company.address}</Typography>
                      <Typography variant="body2">
                        Subscription: {company.subscription_plan.name} ({company.subscription_plan.billing_cycle})
                      </Typography>
                      <Typography variant="body2">
                        Currency: {company.currency.name} ({company.currency.code})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              
              {/* Currencies */}
              {currencies.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Currencies ({currencies.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {currencies.map((currency) => (
                      <Box key={currency.id} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, minWidth: 150 }}>
                        <Typography variant="subtitle2">{currency.name}</Typography>
                        <Typography variant="body2">Code: {currency.code}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Subscription Plans */}
              {subscriptionPlans.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Subscription Plans ({subscriptionPlans.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {subscriptionPlans.map((plan) => (
                    <Box key={plan.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <Typography variant="subtitle2">{plan.name}</Typography>
                      <Typography variant="body2">Price: {plan.price}</Typography>
                      <Typography variant="body2">Billing Cycle: {plan.billing_cycle}</Typography>
                      <Typography variant="body2">Status: {plan.is_active ? 'Active' : 'Inactive'}</Typography>
                      <Typography variant="body2">Storage: {plan.storage_limit_gb} GB</Typography>
                      {plan.description && (
                        <Typography variant="body2">Description: {plan.description}</Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              
              {(companies.length === 0 && currencies.length === 0 && subscriptionPlans.length === 0 && !loading && !error) && (
                <Typography color="text.secondary">
                  No data loaded yet. Click the button above to test the API.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
} 