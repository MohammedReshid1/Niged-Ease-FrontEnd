'use client';

import React, { useEffect, useState } from 'react';
import { paths } from '@/navigation/paths';
import { useStore } from '@/providers/store-provider';
import { financialsApi } from '@/services/api/financials';
import { inventoryApi } from '@/services/api/inventory';
import { Sale, transactionsApi } from '@/services/api/transactions';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { FilePdf as FilePdfIcon } from '@phosphor-icons/react/dist/ssr/FilePdf';
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Pencil as PencilIcon } from '@phosphor-icons/react/dist/ssr/Pencil';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import SaleEditModal from '@/components/admin/sales/SaleEditModal';
import { StockManagerGuard } from '@/components/auth/stock-manager-guard';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageHeader from '@/components/page-header';

export default function StockManagerSalesPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const { currentStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSale, setCurrentSale] = useState<any>(null);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editModalLoading, setEditModalLoading] = useState(false);

  const fetchData = async () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      const salesData = await transactionsApi.getSales(currentStore.id);
      setSales(salesData);
    } catch (error) {
      console.error('Error fetching sales:', error);
      enqueueSnackbar(t('sales.loading_sales_error'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentStore]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenCreateModal = () => {
    setCurrentSale(null);
    setIsSaleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSaleModalOpen(false);
    setCurrentSale(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleEditSale = async (saleId: string) => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'warning' });
      return;
    }

    try {
      setEditModalLoading(true);
      const saleToEdit = await transactionsApi.getSale(currentStore.id, saleId);
      const saleItems = await transactionsApi.getSaleItems(currentStore.id, saleId);

      // Convert sale items to the format expected by the form
      const products = await Promise.all(
        saleItems.map(async (item) => ({
          id: item.product.id,
          name: item.product.name,
          quantity: parseInt(item.quantity, 10),
          unitPrice: 0, // Default value since unit_price is not in the type
          subtotal: parseInt(item.quantity, 10) * 0, // Use 0 as a fallback
        }))
      );

      // Set the current sale for editing
      setCurrentSale({
        id: saleToEdit.id,
        customer_id: saleToEdit.customer.id,
        products: products,
        total_amount: parseFloat(saleToEdit.total_amount),
        amount_paid: parseFloat(saleToEdit.amount_paid || '0'),
        tax: saleToEdit.tax || '0',
        store_id: saleToEdit.store.id,
        currency_id: saleToEdit.currency.id,
        payment_mode_id: saleToEdit.payment_mode.id,
        is_credit: saleToEdit.is_credit,
      });

      setIsSaleModalOpen(true);
    } catch (error) {
      console.error('Error fetching sale details:', error);
      enqueueSnackbar(t('sales.error_loading_sale'), { variant: 'error' });
    } finally {
      setEditModalLoading(false);
    }
  };

  const handleDeleteSale = (id: string) => {
    setSaleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!saleToDelete || !currentStore) {
      enqueueSnackbar(t('sales.no_sale_selected'), { variant: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      await transactionsApi.deleteSale(currentStore.id, saleToDelete);
      enqueueSnackbar(t('sales.sale_deleted'), { variant: 'success' });
      fetchData();
    } catch (error) {
      console.error('Error deleting sale:', error);
      enqueueSnackbar(t('sales.error_deleting'), { variant: 'error' });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setSaleToDelete(null);
    }
  };

  const handleSaveSale = async (saleData: any) => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      // Log the incoming data for debugging
      console.log(
        'Original sale data:',
        saleData,
        'item_sale_price:',
        saleData.products?.map((p: { unitPrice?: number; price?: number }) => p.unitPrice || p.price || 0)
      );

      // Safely convert values and handle undefined
      const safeToString = (value: any) => {
        if (value === undefined || value === null) {
          return '0';
        }
        return value.toString();
      };

      const formattedData = {
        store_id: currentStore.id,
        customer_id: saleData.customer_id || saleData.customer,
        total_amount: safeToString(saleData.total_amount || saleData.totalAmount),
        tax: safeToString(saleData.tax) || '0',
        amount_paid: safeToString(saleData.amount_paid || 0),
        currency_id: saleData.currency_id,
        payment_mode_id: saleData.payment_mode_id,
        is_credit: saleData.is_credit || false,
        items: [],
      };

      // Safely get products array
      const productsArray = Array.isArray(saleData.items)
        ? saleData.items
        : Array.isArray(saleData.products)
          ? saleData.products
          : [];

      // Only map if we have items
      if (productsArray.length > 0) {
        formattedData.items = productsArray.map((item: any) => {
          const product = item.product_id ? item : item;
          return {
            product_id: product.product_id || product.id,
            quantity: safeToString(product.quantity),
            item_sale_price: safeToString(product.price || product.unitPrice || 0),
          };
        });
      }

      console.log('Formatted data for API:', formattedData);

      // Check if items array is empty before sending to API
      if (!formattedData.items || formattedData.items.length === 0) {
        enqueueSnackbar(t('sales.error_no_items'), { variant: 'error' });
        setIsLoading(false);
        return;
      }

      let savedSale;

      if (saleData.id) {
        // Update existing sale
        savedSale = await transactionsApi.updateSale(currentStore.id, saleData.id, formattedData);
        enqueueSnackbar(t('sales.sale_updated'), { variant: 'success' });
      } else {
        // Create new sale
        savedSale = await transactionsApi.createSale(currentStore.id, formattedData);
        enqueueSnackbar(t('sales.sale_created'), { variant: 'success' });
      }

      // Check if there's a partial payment (amount_paid < total_amount)
      const totalAmount = parseFloat(formattedData.total_amount);
      const amountPaid = parseFloat(formattedData.amount_paid);

      if (amountPaid < totalAmount && savedSale) {
        // Calculate the outstanding amount
        const outstandingAmount = (totalAmount - amountPaid).toString();

        // Create a receivable record for the outstanding amount
        try {
          const receivableData = {
            store_id: currentStore.id,
            sale: savedSale.id,
            amount: outstandingAmount,
            currency: formattedData.currency_id,
          };

          await financialsApi.createReceivable(currentStore.id, receivableData);
          console.log('Receivable created for outstanding amount:', outstandingAmount);
        } catch (error) {
          console.error('Error creating receivable:', error);
          enqueueSnackbar('Sale saved but failed to record receivable', { variant: 'warning' });
        }
      }

      setIsSaleModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving sale:', error);
      enqueueSnackbar(t('sales.error_saving'), { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: t('dashboard.title'), url: paths.stockManager.dashboard },
    { label: t('sales.title'), url: paths.stockManager.sales },
  ];

  // Filter sales based on search query
  const filteredSales = sales.filter((sale) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      sale.id.toLowerCase().includes(searchLower) ||
      (sale.customer && sale.customer.name.toLowerCase().includes(searchLower)) ||
      sale.total_amount.toString().includes(searchLower)
    );
  });

  // Paginate sales
  const paginatedSales = filteredSales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <StockManagerGuard>
      <Container>
        <Box sx={{ py: 3 }}>
          <Breadcrumbs items={breadcrumbItems} />

          <PageHeader
            title={t('sales.title')}
            actions={
              <Button variant="contained" color="primary" startIcon={<PlusIcon />} onClick={handleOpenCreateModal}>
                {t('sales.add_sale')}
              </Button>
            }
          />

          <Card>
            <CardHeader
              title={t('sales.all_sales')}
              action={
                <TextField
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 240 }}
                  size="small"
                />
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('common.id')}</TableCell>
                      <TableCell>{t('sales.sale_customer')}</TableCell>
                      <TableCell>{t('common.date')}</TableCell>
                      <TableCell>{t('sales.sale_total')}</TableCell>
                      <TableCell>{t('sales.amount_paid')}</TableCell>
                      <TableCell>{t('sales.balance')}</TableCell>
                      <TableCell>{t('sales.sale_status')}</TableCell>
                      <TableCell align="right">{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          {t('sales.loading_sales')}
                        </TableCell>
                      </TableRow>
                    ) : paginatedSales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          {searchQuery ? t('common.no_results') : t('sales.no_sales')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{sale.id.slice(0, 8)}...</TableCell>
                          <TableCell>{sale.customer ? sale.customer.name : 'N/A'}</TableCell>
                          <TableCell>{formatDateTime(sale.created_at)}</TableCell>
                          <TableCell>
                            {formatCurrency(parseFloat(sale.total_amount))} {sale.currency?.code}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(parseFloat(sale.amount_paid || '0'))} {sale.currency?.code}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(parseFloat(sale.total_amount) - parseFloat(sale.amount_paid || '0'))}{' '}
                            {sale.currency?.code}
                          </TableCell>
                          <TableCell>{sale.is_credit ? t('sales.credit') : t('sales.confirmed')}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleEditSale(sale.id)}
                              disabled={editModalLoading}
                            >
                              <PencilIcon />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteSale(sale.id)}>
                              <TrashIcon />
                            </IconButton>
                            <IconButton size="small">
                              <FilePdfIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredSales.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Sale edit/create modal */}
        <SaleEditModal
          open={isSaleModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveSale}
          sale={currentSale}
          isNew={!currentSale}
        />

        {/* Delete confirmation modal */}
        <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
          <DialogTitle>{t('sales.delete_sale')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('sales.confirm_delete')}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={isLoading}>
              {t('common.delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </StockManagerGuard>
  );
}
