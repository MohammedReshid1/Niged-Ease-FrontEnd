'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '@/providers/auth-provider';
import { useStore } from '@/providers/store-provider';
import { useSnackbar } from 'notistack';
import { predictionsApi, PredictionResponse } from '@/services/api/predictions';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useRouter } from 'next/navigation';
import { LineChart } from '@/components/charts/line-chart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`predictions-tabpanel-${index}`}
      aria-labelledby={`predictions-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function PredictionsPage() {
  const { userInfo } = useAuth();
  const { currentStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [companyPredictions, setCompanyPredictions] = useState<{
    customers: PredictionResponse | null;
    profit: PredictionResponse | null;
    revenue: PredictionResponse | null;
  }>({
    customers: null,
    profit: null,
    revenue: null
  });
  const [storePredictions, setStorePredictions] = useState<{
    customers: PredictionResponse | null;
    profit: PredictionResponse | null;
    revenue: PredictionResponse | null;
  }>({
    customers: null,
    profit: null,
    revenue: null
  });

  // Debug logging for userInfo
  console.log('PredictionsPage userInfo:', userInfo);
  console.log('PredictionsPage userInfo.company_id:', userInfo?.company_id);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        const companyId = userInfo?.company_id;
        const storeId = currentStore?.id;

        console.log('Fetching predictions with:', { companyId, storeId, userInfo, currentStore });

        if (!companyId) {
          console.error('No company ID available in userInfo:', userInfo);
          enqueueSnackbar('No company ID available. Please ensure you have a company assigned.', { variant: 'error' });
          return;
        }

        if (companyId) {
          console.log('Fetching company predictions for ID:', companyId);
          const [customers, profit, revenue] = await Promise.all([
            predictionsApi.getCompanyCustomerPredictions(companyId),
            predictionsApi.getCompanyProfitPredictions(companyId),
            predictionsApi.getCompanyRevenuePredictions(companyId)
          ]);

          console.log('Company predictions received:', { customers, profit, revenue });

          setCompanyPredictions({
            customers,
            profit,
            revenue
          });
        }

        if (storeId) {
          console.log('Fetching store predictions for ID:', storeId);
          const [customers, profit, revenue] = await Promise.all([
            predictionsApi.getStoreCustomerPredictions(storeId),
            predictionsApi.getStoreProfitPredictions(storeId),
            predictionsApi.getStoreRevenuePredictions(storeId)
          ]);

          console.log('Store predictions received:', { customers, profit, revenue });

          setStorePredictions({
            customers,
            profit,
            revenue
          });
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
        enqueueSnackbar('Failed to load predictions', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [userInfo, currentStore, enqueueSnackbar]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  const formatChartData = (predictions: PredictionResponse | null): ChartData | null => {
    if (!predictions) return null;
    return {
      labels: predictions.projections.map(p => p.date),
      datasets: [{
        label: predictions.metric_predicted.charAt(0).toUpperCase() + predictions.metric_predicted.slice(1),
        data: predictions.projections.map(p => p.predicted_value),
        borderColor: '#14B8A6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        fill: true
      }]
    };
  };

  return (
    <Container>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowLeftIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4">
            Business Predictions
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Predictions Overview
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Company Predictions" />
              <Tab label="Store Predictions" />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              {!userInfo?.company_id ? (
                <Alert severity="info">
                  No company predictions available. Please ensure you have a company assigned.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Customer Predictions" />
                      <CardContent>
                        {companyPredictions.customers && (
                          <LineChart data={formatChartData(companyPredictions.customers) || { labels: [], datasets: [] }} />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Profit Predictions" />
                      <CardContent>
                        {companyPredictions.profit && (
                          <LineChart data={formatChartData(companyPredictions.profit) || { labels: [], datasets: [] }} />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Revenue Predictions" />
                      <CardContent>
                        {companyPredictions.revenue && (
                          <LineChart data={formatChartData(companyPredictions.revenue) || { labels: [], datasets: [] }} />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {!currentStore?.id ? (
                <Alert severity="info">
                  No store predictions available. Please select a store from the store selector.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Customer Predictions" />
                      <CardContent>
                        {storePredictions.customers && (
                          <LineChart data={formatChartData(storePredictions.customers) || { labels: [], datasets: [] }} />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Profit Predictions" />
                      <CardContent>
                        {storePredictions.profit && (
                          <LineChart data={formatChartData(storePredictions.profit) || { labels: [], datasets: [] }} />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Revenue Predictions" />
                      <CardContent>
                        {storePredictions.revenue && (
                          <LineChart data={formatChartData(storePredictions.revenue) || { labels: [], datasets: [] }} />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </TabPanel>
          </>
        )}
      </Box>
    </Container>
  );
}