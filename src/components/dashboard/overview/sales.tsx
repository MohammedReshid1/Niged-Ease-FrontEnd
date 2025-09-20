'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface SalesProps {
  chartSeries: { name: string; data: number[] }[];
  sx?: SxProps;
}

export function Sales({ chartSeries, sx }: SalesProps): React.JSX.Element {
  const chartOptions = useChartOptions();

  return (
    <Card 
      sx={{ 
        ...sx,
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <CardHeader
        title="Sales"
        titleTypographyProps={{
          sx: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'text.primary',
          }
        }}
        action={
          <Button 
            color="primary" 
            size="small" 
            startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" weight="bold" />}
            sx={{
              borderRadius: '8px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
              }
            }}
          >
            Sync
          </Button>
        }
        sx={{
          p: 3,
          pb: 0
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Chart height={350} options={chartOptions} series={chartSeries} type="bar" width="100%" />
      </CardContent>
      <Divider sx={{ mx: 3, borderColor: 'rgba(0, 0, 0, 0.08)' }} />
      <CardActions sx={{ justifyContent: 'flex-end', p: 2, px: 3 }}>
        <Button 
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" weight="bold" />} 
          size="small"
          sx={{
            borderRadius: '8px',
            fontWeight: 600,
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            }
          }}
        >
          Overview
        </Button>
      </CardActions>
    </Card>
  );
}

function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: { 
      background: 'transparent', 
      stacked: false, 
      toolbar: { show: false },
      fontFamily: '"Inter", sans-serif',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    colors: ['#6366F1', alpha('#6366F1', 0.25)],
    dataLabels: { 
      enabled: false,
    },
    fill: { 
      opacity: 1, 
      type: 'solid',
      gradient: {
        shade: 'light',
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 1,
        opacityTo: 0.8,
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10
      }
    },
    legend: { 
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      fontSize: '13px',
      offsetY: -25,
      offsetX: -5,
      labels: {
        colors: theme.palette.text.secondary
      },
      markers: {
        size: 12,
        strokeWidth: 0,
        offsetX: 0,
        offsetY: 0
      },
      itemMargin: {
        horizontal: 8,
        vertical: 0
      },
    },
    plotOptions: { 
      bar: { 
        columnWidth: '40%',
        borderRadius: 6,
        dataLabels: {
          position: 'top',
        },
      } 
    },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { 
        offsetY: 5, 
        style: { 
          colors: theme.palette.text.secondary,
          fontSize: '12px',
          fontWeight: 500,
        } 
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}K` : `${value}`),
        offsetX: -10,
        style: { 
          colors: theme.palette.text.secondary,
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      style: {
        fontSize: '12px',
        fontFamily: '"Inter", sans-serif',
      },
      y: {
        formatter: (value) => `$${value}K`
      }
    },
  };
}
