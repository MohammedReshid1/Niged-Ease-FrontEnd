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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InputAdornment from '@mui/material/InputAdornment';
import { FilePdf as FilePdfIcon } from '@phosphor-icons/react/dist/ssr/FilePdf';
import { Printer as PrinterIcon } from '@phosphor-icons/react/dist/ssr/Printer';
import { FileXls as FileXlsIcon } from '@phosphor-icons/react/dist/ssr/FileXls';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { ArrowUp as ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { ArrowDown as ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { paths } from '@/paths';

export default function UsersReportPage(): React.JSX.Element {
  const [tabValue, setTabValue] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState('');

  // Mock suppliers data
  const suppliers = [
    { id: '1', name: 'Armstrong PLC', purchases: 2, purchaseReturns: 1, sales: 0, salesReturns: 0, totalAmount: '$541.84', paidAmount: '$109,586.00', dueAmount: '$109,044.16', dueDirection: 'down' },
    { id: '2', name: 'Johnson Ltd', purchases: 3, purchaseReturns: 0, sales: 0, salesReturns: 0, totalAmount: '$2,557.00', paidAmount: '$567,932.00', dueAmount: '$570,489.00', dueDirection: 'up' },
    { id: '3', name: 'Wunsch, Kehleran and Gulgowski', purchases: 0, purchaseReturns: 0, sales: 0, salesReturns: 0, totalAmount: '$0.00', paidAmount: '$790,804.00', dueAmount: '$790,804.00', dueDirection: 'up' },
    { id: '4', name: 'Mertz-Tromp', purchases: 1, purchaseReturns: 1, sales: 0, salesReturns: 0, totalAmount: '$521.00', paidAmount: '$268,802.00', dueAmount: '$268,281.00', dueDirection: 'up' },
    { id: '5', name: 'Kozey Inc', purchases: 2, purchaseReturns: 0, sales: 0, salesReturns: 0, totalAmount: '$3,404.00', paidAmount: '$943,178.00', dueAmount: '$946,582.00', dueDirection: 'up' },
    { id: '6', name: 'Sauer-Reichel', purchases: 0, purchaseReturns: 0, sales: 0, salesReturns: 0, totalAmount: '$0.00', paidAmount: '$586,800.00', dueAmount: '$586,800.00', dueDirection: 'up' },
    { id: '7', name: 'Miller, Marks and Kub', purchases: 1, purchaseReturns: 0, sales: 0, salesReturns: 0, totalAmount: '$43.00', paidAmount: '$184,077.00', dueAmount: '$184,120.00', dueDirection: 'up' },
    { id: '8', name: 'Carroll Inc', purchases: 1, purchaseReturns: 0, sales: 0, salesReturns: 0, totalAmount: '$217.00', paidAmount: '$382,793.00', dueAmount: '$383,010.00', dueDirection: 'up' },
    { id: '9', name: 'Cruickshank-Turcotte', purchases: 3, purchaseReturns: 1, sales: 0, salesReturns: 0, totalAmount: '$228.06', paidAmount: '$115,470.00', dueAmount: '$115,698.06', dueDirection: 'down' },
    { id: '10', name: 'Mayert-Schmeler', purchases: 1, purchaseReturns: 1, sales: 0, salesReturns: 0, totalAmount: '$296.00', paidAmount: '$984,118.00', dueAmount: '$983,822.00', dueDirection: 'down' }
  ];

  // Calculate totals
  const totalPurchases = suppliers.reduce((sum, user) => sum + user.purchases, 0);
  const totalPurchaseReturns = suppliers.reduce((sum, user) => sum + user.purchaseReturns, 0);
  const totalSales = suppliers.reduce((sum, user) => sum + user.sales, 0);
  const totalSalesReturns = suppliers.reduce((sum, user) => sum + user.salesReturns, 0);
  const totalAmount = suppliers.reduce((sum, user) => {
    const amount = parseFloat(user.totalAmount.replace(/[$,]/g, ''));
    return sum + amount;
  }, 0);
  const totalPaidAmount = suppliers.reduce((sum, user) => {
    const amount = parseFloat(user.paidAmount.replace(/[$,]/g, ''));
    return sum + amount;
  }, 0);
  const totalDueAmount = suppliers.reduce((sum, user) => {
    const amount = parseFloat(user.dueAmount.replace(/[$,]/g, ''));
    return sum + (user.dueDirection === 'up' ? amount : -amount);
  }, 0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.stockManager.dashboard },
    { label: 'Reports', url: paths.stockManager.reports },
    { label: 'Users Reports', url: paths.stockManager.userReports },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Users Reports</Typography>
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

      {/* Tabs and Search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ '& .MuiTabs-indicator': { bgcolor: '#0ea5e9' } }}
        >
          <Tab 
            label="Suppliers" 
            sx={{ 
              textTransform: 'none', 
              minWidth: 100,
              color: tabValue === 0 ? '#0ea5e9' : 'inherit',
              '&.Mui-selected': { color: '#0ea5e9' }
            }} 
          />
        </Tabs>
        
        <TextField
          placeholder="Search..."
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MagnifyingGlassIcon size={20} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 200 }}
        />
      </Box>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Purchases</TableCell>
              <TableCell align="center">Purchase Return / Dr. Note</TableCell>
              <TableCell align="center">Sales</TableCell>
              <TableCell align="center">Sales Return / Cr. Note</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell align="right">Paid Amount</TableCell>
              <TableCell align="right">Due Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} hover>
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
                      {supplier.name.charAt(0)}
                    </Box>
                    {supplier.name}
                  </Box>
                </TableCell>
                <TableCell align="center">{supplier.purchases}</TableCell>
                <TableCell align="center">{supplier.purchaseReturns}</TableCell>
                <TableCell align="center">{supplier.sales}</TableCell>
                <TableCell align="center">{supplier.salesReturns}</TableCell>
                <TableCell align="right">{supplier.totalAmount}</TableCell>
                <TableCell align="right">{supplier.paidAmount}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {supplier.dueDirection === 'down' ? (
                      <ArrowDownIcon size={16} color="#22c55e" style={{ marginRight: '4px' }} />
                    ) : (
                      <ArrowUpIcon size={16} color="#ef4444" style={{ marginRight: '4px' }} />
                    )}
                    {supplier.dueAmount}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>{totalPurchases}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>{totalPurchaseReturns}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>{totalSales}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>{totalSalesReturns}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>-${Math.abs(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>${totalPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {totalDueAmount < 0 ? (
                    <ArrowDownIcon size={16} color="#22c55e" style={{ marginRight: '4px' }} />
                  ) : (
                    <ArrowUpIcon size={16} color="#ef4444" style={{ marginRight: '4px' }} />
                  )}
                  ${Math.abs(totalDueAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
} 