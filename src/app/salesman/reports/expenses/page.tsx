'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { FilePdf as FilePdfIcon } from '@phosphor-icons/react/dist/ssr/FilePdf';
import { Printer as PrinterIcon } from '@phosphor-icons/react/dist/ssr/Printer';
import { FileXls as FileXlsIcon } from '@phosphor-icons/react/dist/ssr/FileXls';
import { Calendar as CalendarIcon } from '@phosphor-icons/react/dist/ssr/Calendar';
import { paths } from '@/paths';

export default function ExpensesReportPage(): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  // Mock expense data
  const expenses = [
    { id: '1', date: '26-04-2025', category: 'Travel', user: 'Sales', amount: '$48.00' },
    { id: '2', date: '26-04-2025', category: 'Utilities', user: 'Mafalda Bahringer DDS', amount: '$50.00' },
  ];

  // Calculate total
  const total = expenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount.replace(/[$,]/g, ''));
    return sum + amount;
  }, 0);

  // Sample list of categories
  const categories = [
    { value: '', label: 'Select Expense Category...' },
    { value: 'travel', label: 'Travel' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'rent', label: 'Rent' },
    { value: 'office', label: 'Office Supplies' },
    { value: 'meals', label: 'Meals & Entertainment' },
  ];

  // Sample list of users
  const users = [
    { value: '', label: 'Select User...' },
    { value: 'sales', label: 'Sales' },
    { value: 'mafalda', label: 'Mafalda Bahringer DDS' },
    { value: 'admin', label: 'Admin' },
  ];

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.stockManager.dashboard },
    { label: 'Reports', url: paths.stockManager.reports },
    { label: 'Expense Reports', url: paths.stockManager.expenseReports },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Expense Reports</Typography>
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

      {/* Export Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<FilePdfIcon />}
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          PDF
        </Button>
        <Button 
          variant="contained"
          startIcon={<PrinterIcon />}
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          Print
        </Button>
        <Button 
          variant="contained"
          startIcon={<FileXlsIcon />}
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          Excel
        </Button>
      </Box>

      {/* Filter Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            label="Select Expense Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="Select User"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {users.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon size={20} />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Expenses Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Expense Category</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id} hover>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.user}</TableCell>
                <TableCell align="right">{expense.amount}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                Total
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          10 / page
        </Typography>
      </Box>
    </Box>
  );
} 