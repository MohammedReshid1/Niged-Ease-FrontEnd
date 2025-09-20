import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDown as ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUp as ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

export interface TotalCustomersProps {
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: string;
}

export function TotalCustomers({ diff, trend, sx, value }: TotalCustomersProps): React.JSX.Element {
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';
  const trendBgColor = trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)';

  return (
    <Card 
      sx={{ 
        ...sx,
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        overflow: 'visible',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, rgba(20, 184, 166, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography 
                color="text.secondary" 
                variant="overline" 
                sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: 'text.secondary'
                }}
              >
                Total Customers
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {value}
              </Typography>
            </Stack>
            <Avatar 
              sx={{ 
                background: 'linear-gradient(135deg, #14B8A6 0%, #6366F1 100%)',
                height: '64px', 
                width: '64px',
                boxShadow: '0 8px 16px rgba(20, 184, 166, 0.25)',
                border: '4px solid #FFF',
              }}
            >
              <UsersIcon fontSize="var(--icon-fontSize-lg)" weight="bold" />
            </Avatar>
          </Stack>
          {diff ? (
            <Stack 
              sx={{ 
                alignItems: 'center',
                backgroundColor: trendBgColor,
                borderRadius: '10px',
                py: 1,
                px: 2,
              }} 
              direction="row" 
              spacing={2}
            >
              <Stack sx={{ alignItems: 'center' }} direction="row" spacing={0.5}>
                <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-md)" weight="bold" />
                <Typography 
                  color={trendColor} 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600 
                  }}
                >
                  {diff}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 500 }}>
                Since last month
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
