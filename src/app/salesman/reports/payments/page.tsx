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

export default function PaymentsReportPage(): React.JSX.Element {
  const [selectedUser, setSelectedUser] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  // Mock payment data
  const payments = [
    { id: '1', date: '29-04-2025', reference: 'PAY-IN-27', type: 'Payment In', user: 'Prof. Jacklyn Rohan V', mode: 'Paypal', amount: '$41.12' },
    { id: '2', date: '28-04-2025', reference: 'PAY-IN-15', type: 'Payment In', user: 'Jasper Lueilwitz', mode: 'Cash', amount: '$3,474.00' },
    { id: '3', date: '27-04-2025', reference: 'PAY-IN-23', type: 'Payment In', user: 'Dr. Jamir Walter', mode: 'Cash', amount: '$508.00' },
    { id: '4', date: '27-04-2025', reference: 'PAY-IN-26', type: 'Payment In', user: 'Efrain Hermann', mode: 'Paypal', amount: '$454.25' },
    { id: '5', date: '26-04-2025', reference: 'PAY-IN-25', type: 'Payment In', user: 'Alexis Collins', mode: 'Stripe', amount: '$4,040.60' },
    { id: '6', date: '26-04-2025', reference: 'PAY-IN-16', type: 'Payment In', user: 'Reva Stracke III', mode: 'Paypal', amount: '$122.00' },
    { id: '7', date: '25-04-2025', reference: 'PAY-IN-22', type: 'Payment In', user: 'Alex Mann Sr.', mode: 'Paypal', amount: '$82.00' },
    { id: '8', date: '24-04-2025', reference: 'PAY-IN-21', type: 'Payment In', user: 'Corbin Hoppe Jr.', mode: 'Paypal', amount: '$1,064.35' },
    { id: '9', date: '24-04-2025', reference: 'PAY-IN-17', type: 'Payment In', user: 'Dr. Durward Shields Jr.', mode: 'Cash', amount: '$81.00' },
    { id: '10', date: '24-04-2025', reference: 'PAY-IN-19', type: 'Payment In', user: 'Ulices Gorcany', mode: 'Stripe', amount: '$348.00' },
  ];

  // Calculate total
  const total = payments.reduce((sum, payment) => {
    const amount = parseFloat(payment.amount.replace(/[$,]/g, ''));
    return sum + amount;
  }, 0);

  // Sample list of users for the dropdown
  const users = [
    { value: '', label: 'Select User...' },
    { value: 'jacklyn', label: 'Prof. Jacklyn Rohan V' },
    { value: 'jasper', label: 'Jasper Lueilwitz' },
    { value: 'jamir', label: 'Dr. Jamir Walter' },
    { value: 'efrain', label: 'Efrain Hermann' },
    { value: 'alexis', label: 'Alexis Collins' },
  ];

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.stockManager.dashboard },
    { label: 'Reports', url: paths.stockManager.reports },
    { label: 'Payments', url: paths.stockManager.paymentReports },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Payments</Typography>
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

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment Date</TableCell>
              <TableCell>Reference Number</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Mode Type</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.reference}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: '#0ea5e9',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        mr: 1,
                        fontSize: '0.75rem',
                      }}
                    >
                      {payment.user.charAt(0)}
                    </Box>
                    {payment.user}
                  </Box>
                </TableCell>
                <TableCell>{payment.mode}</TableCell>
                <TableCell align="right">{payment.amount}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} sx={{ fontWeight: 'bold', textAlign: 'right' }}>
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