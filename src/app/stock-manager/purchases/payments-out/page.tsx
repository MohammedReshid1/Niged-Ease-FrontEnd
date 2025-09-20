'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { paths } from '@/paths';
import PaymentOutEditModal from '@/components/admin/payments/PaymentOutEditModal';

export default function PaymentOutPage(): React.JSX.Element {
  const [selectedPayments, setSelectedPayments] = React.useState<string[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [currentPayment, setCurrentPayment] = React.useState<any>(null);
  
  // Mock payment data
  const payments = [
    { id: '1', date: '19-04-2025', supplier: 'ABC Supplier', purchaseNo: 'PO-1', amount: 1250.00, bank: 'Example Bank', paymentMethod: 'Bank Transfer' },
    { id: '2', date: '19-04-2025', supplier: 'XYZ Supplier', purchaseNo: 'PO-2', amount: 780.00, bank: 'Another Bank', paymentMethod: 'Bank Transfer' },
    { id: '3', date: '19-04-2025', supplier: 'Office Supply Co', purchaseNo: 'PO-3', amount: 420.00, bank: 'Example Bank', paymentMethod: 'Check' },
  ];

  // Calculate total amount
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPayments(payments.map(payment => payment.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedPayments.includes(id)) {
      setSelectedPayments(selectedPayments.filter(paymentId => paymentId !== id));
    } else {
      setSelectedPayments([...selectedPayments, id]);
    }
  };

  const handleAddNewPayment = () => {
    setCurrentPayment({
      date: new Date().toISOString().split('T')[0],
      supplier: '',
      purchaseNo: '',
      amount: 0,
      bank: '',
      paymentMethod: '',
      reference: '',
      note: ''
    });
    setIsPaymentModalOpen(true);
  };

  const handleEditPayment = (id: string) => {
    const paymentToEdit = payments.find(payment => payment.id === id);
    if (paymentToEdit) {
      setCurrentPayment(paymentToEdit);
      setIsPaymentModalOpen(true);
    }
  };

  const handleSavePayment = (paymentData: any) => {
    if (paymentData.id) {
      // Update existing payment
      console.log(`Updated payment: ${JSON.stringify(paymentData)}`);
    } else {
      // Add new payment
      console.log(`Added new payment: ${JSON.stringify(paymentData)}`);
    }
    setIsPaymentModalOpen(false);
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Payments', url: paths.admin.payments },
    { label: 'Payment Out', url: paths.admin.paymentOut },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Payment Out</Typography>
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

      {/* Action Buttons and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNewPayment}
          >
            Add Payment
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <OutlinedInput
            placeholder="Search..."
            size="small"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon size={20} />
              </InputAdornment>
            }
            sx={{ width: 200 }}
          />
          <Select
            displayEmpty
            value=""
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select Supplier...</Typography>;
              }
              return selected;
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Suppliers</MenuItem>
            <MenuItem value="ABC Supplier">ABC Supplier</MenuItem>
            <MenuItem value="XYZ Supplier">XYZ Supplier</MenuItem>
            <MenuItem value="Office Supply Co">Office Supply Co</MenuItem>
          </Select>
          <Box sx={{ 
            display: 'flex', 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            overflow: 'hidden',
            alignItems: 'center',
          }}>
            <input 
              type="text" 
              placeholder="Start Date"
              style={{ 
                border: 'none', 
                padding: '8px 12px',
                outline: 'none',
                width: 100
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>→</Box>
            <input 
              type="text" 
              placeholder="End Date"
              style={{ 
                border: 'none', 
                padding: '8px 12px',
                outline: 'none',
                width: 100
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={payments.length > 0 && selectedPayments.length === payments.length}
                  indeterminate={selectedPayments.length > 0 && selectedPayments.length < payments.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Purchase No.</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Bank</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => handleSelectOne(payment.id)}
                  />
                </TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.supplier}</TableCell>
                <TableCell>{payment.purchaseNo}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{payment.bank}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: '#0ea5e9', 
                        color: 'white',
                        '&:hover': { bgcolor: '#0284c7' }  
                      }}
                      onClick={() => handleEditPayment(payment.id)}
                    >
                      <PencilSimpleIcon size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</TableCell>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>&lt;</Button>
              <Button 
                size="small" 
                sx={{ 
                  minWidth: 24, 
                  height: 24, 
                  p: 0, 
                  mx: 0.5, 
                  border: '1px solid #0ea5e9', 
                  borderRadius: 1,
                  color: '#0ea5e9' 
                }}
              >
                1
              </Button>
              <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>&gt;</Button>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              10 / page <Box component="span" sx={{ ml: 0.5, cursor: 'pointer' }}>▼</Box>
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Modals */}
      {isPaymentModalOpen && currentPayment && (
        <PaymentOutEditModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSave={handleSavePayment}
          payment={currentPayment}
        />
      )}
    </Box>
  );
} 