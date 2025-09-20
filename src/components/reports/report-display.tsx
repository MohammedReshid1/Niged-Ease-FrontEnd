import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ReportData } from '@/services/api/reports';

interface ReportDisplayProps {
  data: ReportData;
  format: 'table' | 'graph';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ReportDisplay({ data, format }: ReportDisplayProps) {
  const renderSummaryCards = () => {
    const summaryItems = Object.entries(data)
      .filter(([key, value]) => 
        typeof value === 'number' && 
        !key.includes('date') && 
        !key.includes('percentage') &&
        !key.includes('rate')
      )
      .map(([key, value]) => ({
        title: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        value: typeof value === 'number' ? value.toLocaleString() : value
      }));

    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summaryItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {item.title}
                </Typography>
                <Typography variant="h6">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderTable = () => {
    // Find the first array in the data that contains objects
    const tableData = Object.entries(data).find(([_, value]) => 
      Array.isArray(value) && value.length > 0 && typeof value[0] === 'object'
    );

    if (!tableData) return null;

    const [key, rows] = tableData;
    const columns = Object.keys(rows[0]);

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {typeof row[column] === 'number' 
                      ? row[column].toLocaleString() 
                      : row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderChart = () => {
    // Find the first array in the data that contains objects
    const chartData = Object.entries(data).find(([_, value]) => 
      Array.isArray(value) && value.length > 0 && typeof value[0] === 'object'
    );

    if (!chartData) return null;

    const [_, rows] = chartData;
    const columns = Object.keys(rows[0]);

    // Determine if we should use a line chart or bar chart based on the data
    const isTimeSeries = columns.some(col => col.toLowerCase().includes('date') || col.toLowerCase().includes('time'));
    const numericColumns = columns.filter(col => 
      typeof rows[0][col] === 'number' && 
      !col.toLowerCase().includes('id') &&
      !col.toLowerCase().includes('index')
    );

    if (isTimeSeries) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={columns.find(col => col.toLowerCase().includes('date')) || columns[0]} 
              tickFormatter={(value) => {
                if (typeof value === 'string') {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                }
                return value;
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {numericColumns.map((column, index) => (
              <Line
                key={column}
                type="monotone"
                dataKey={column}
                stroke={COLORS[index % COLORS.length]}
                name={column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // For non-time series data, use a bar chart
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={columns[0]} />
          <YAxis />
          <Tooltip />
          <Legend />
          {numericColumns.map((column, index) => (
            <Bar
              key={column}
              dataKey={column}
              fill={COLORS[index % COLORS.length]}
              name={column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Box>
      {renderSummaryCards()}
      {format === 'table' && renderTable()}
      {format === 'graph' && renderChart()}
    </Box>
  );
} 