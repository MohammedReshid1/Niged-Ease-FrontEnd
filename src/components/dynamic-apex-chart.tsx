'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { ApexOptions } from 'apexcharts';

// Dynamically import ApexCharts on the client side only
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading chart...</Box>
  ),
});

interface DynamicApexChartProps {
  type:
    | 'line'
    | 'area'
    | 'bar'
    | 'pie'
    | 'donut'
    | 'scatter'
    | 'bubble'
    | 'heatmap'
    | 'candlestick'
    | 'boxPlot'
    | 'radar'
    | 'polarArea'
    | 'rangeBar'
    | 'treemap';
  series: any[];
  options: ApexOptions;
  height?: number;
  width?: number | string;
}

export default function DynamicApexChart({
  type,
  series,
  options,
  height = 400,
  width = '100%',
}: DynamicApexChartProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render the chart on the client
  if (!isClient) {
    return <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading chart...</Box>;
  }

  return <ReactApexChart type={type} series={series} options={options} height={height} width={width} />;
}
