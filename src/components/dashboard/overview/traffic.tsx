'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Desktop as DesktopIcon } from '@phosphor-icons/react/dist/ssr/Desktop';
import { DeviceTablet as DeviceTabletIcon } from '@phosphor-icons/react/dist/ssr/DeviceTablet';
import { Phone as PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

const iconMapping = { Desktop: DesktopIcon, Tablet: DeviceTabletIcon, Phone: PhoneIcon } as Record<string, Icon>;

const colorMapping = {
  Desktop: 'linear-gradient(135deg, #0694A2 0%, #047481 100%)',
  Tablet: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
  Phone: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
};

export interface TrafficProps {
  chartSeries: number[];
  labels: string[];
  sx?: SxProps;
}

export function Traffic({ chartSeries, labels, sx }: TrafficProps): React.JSX.Element {
  const chartOptions = useChartOptions(labels);

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
        title="Traffic Source" 
        titleTypographyProps={{
          sx: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'text.primary',
          }
        }}
        sx={{
          p: 3,
          pb: 0,
          '& .MuiCardHeader-action': {
            margin: 0
          }
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />
          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              mt: 2
            }}
          >
            {chartSeries.map((item, index) => {
              const label = labels[index];
              const Icon = iconMapping[label];
              const bgGradient = colorMapping[label as keyof typeof colorMapping] || 'linear-gradient(135deg, #0694A2 0%, #047481 100%)';

              return (
                <Stack 
                  key={label} 
                  spacing={1.5} 
                  sx={{ 
                    alignItems: 'center',
                    p: 2,
                    px: 3,
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid',
                    borderColor: 'rgba(203, 213, 225, 0.12)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      borderColor: 'rgba(203, 213, 225, 0.25)',
                    }
                  }}
                >
                  {Icon ? (
                    <div 
                      style={{ 
                        background: bgGradient,
                        borderRadius: '12px',
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <Icon fontSize="var(--icon-fontSize-lg)" weight="bold" color="#FFFFFF" />
                    </div>
                  ) : null}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: '1.5rem',
                      background: bgGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {item}%
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { 
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    colors: ['#0694A2', '#10B981', '#F59E0B'],
    dataLabels: { 
      enabled: false 
    },
    labels,
    legend: { 
      show: false 
    },
    plotOptions: { 
      pie: { 
        expandOnClick: false,
        donut: {
          size: '85%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontWeight: 600,
              color: theme.palette.text.primary,
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '30px',
              fontWeight: 700,
              color: theme.palette.primary.main,
              offsetY: 10
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '16px',
              fontWeight: 400,
              color: theme.palette.text.secondary,
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0) + '%';
              }
            }
          }
        }
      } 
    },
    states: { 
      active: { 
        filter: { 
          type: 'none' 
        } 
      }, 
      hover: { 
        filter: { 
          type: 'none' 
        } 
      } 
    },
    stroke: { 
      width: 2,
      colors: [theme.palette.background.paper]
    },
    theme: { 
      mode: theme.palette.mode 
    },
    tooltip: { 
      fillSeriesColor: false,
      style: {
        fontSize: '14px'
      },
      y: {
        formatter: function(value) {
          return value + '%';
        }
      }
    },
  };
}
