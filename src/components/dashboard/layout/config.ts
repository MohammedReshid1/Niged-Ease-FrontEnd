import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'account', title: 'My Profile', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];

export interface NavItemsConfig {
  items?: NavItemConfig[];
  subheader?: string;
}

export interface NavSearchConfig {
  placeholder?: string;
}

export const adminNavItems = [
  { key: 'admin-dashboard', title: 'Dashboard', href: paths.admin.dashboard, icon: 'chart-pie' },
  {
    key: 'admin-product-manager',
    title: 'Product Manager',
    href: paths.admin.productManager,
    icon: 'package',
    items: [
      { key: 'admin-categories', title: 'Categories', href: paths.admin.categories },
      { key: 'admin-product-units', title: 'Product Units', href: paths.admin.productUnits },
      {
        key: 'admin-clothing',
        title: 'Clothing',
        href: paths.admin.clothing,
        items: [
          { key: 'admin-clothing-colors', title: 'Colors', href: paths.admin.clothingColors },
          { key: 'admin-clothing-seasons', title: 'Seasons', href: paths.admin.clothingSeasons },
          { key: 'admin-clothing-collections', title: 'Collections', href: paths.admin.clothingCollections },
        ],
      },
      {
        key: 'admin-products',
        title: 'Products',
        href: paths.admin.products,
      },
    ],
  },
  { key: 'admin-parties', title: 'Parties', href: paths.admin.parties, icon: 'users' },
  { key: 'admin-stores', title: 'Stores', href: paths.admin.stores, icon: 'storefront' },
  {
    key: 'admin-payments',
    title: 'Payments',
    href: paths.admin.payments,
    icon: 'credit-card',
    items: [
      { key: 'admin-payment-modes', title: 'Payment Modes', href: paths.admin.paymentModes },
      { key: 'admin-payments-main', title: 'All Payments', href: paths.admin.payments },
    ],
  },
  { key: 'admin-purchases', title: 'Purchases', href: paths.admin.purchases, icon: 'shopping-bag' },
  { key: 'admin-sales', title: 'Sales', href: paths.admin.sales, icon: 'currency-dollar' },
  {
    key: 'admin-expenses',
    title: 'Expenses',
    href: paths.admin.expenses,
    icon: 'bank',
    items: [
      { key: 'admin-expense-main', title: 'All Expenses', href: paths.admin.expenses },
      { key: 'admin-expense-categories', title: 'Categories', href: paths.admin.expenseCategories },
    ],
  },
  { key: 'admin-users', title: 'Users', href: paths.admin.users, icon: 'user-gear' },
  { key: 'admin-reports', title: 'Reports', href: paths.admin.reports, icon: 'chart-line' },
  { key: 'admin-predictions', title: 'Predictions', href: paths.admin.predictions, icon: 'chart-line' },
  {
    key: 'admin-invoice-verification',
    title: 'Invoice Verification',
    href: paths.admin.invoiceVerification,
    icon: 'file-text',
  },
  {
    key: 'admin-inventory-search',
    title: 'Inventory Search',
    href: paths.admin.inventorySearch,
    icon: 'magnifying-glass',
  },
  {
    key: 'admin-stock-transfers',
    title: 'Stock Transfers',
    href: paths.admin.stockTransfers,
    icon: 'arrows-left-right',
  },
  { key: 'admin-activity-logs', title: 'Activity Logs', href: paths.admin.activityLogs, icon: 'clock-history' },
] satisfies NavItemConfig[];

export const stockManagerNavItems = [
  { key: 'stock-manager-dashboard', title: 'Dashboard', href: paths.stockManager.dashboard, icon: 'chart-pie' },
  { key: 'stock-manager-parties', title: 'Parties', href: paths.stockManager.parties, icon: 'users' },
  { key: 'stock-manager-purchases', title: 'Purchases', href: paths.stockManager.purchases, icon: 'shopping-bag' },
  { key: 'stock-manager-expenses', title: 'Expenses', href: paths.stockManager.expenses, icon: 'bank' },
  { key: 'stock-manager-payments', title: 'Payments', href: paths.stockManager.payments, icon: 'credit-card' },
  {
    key: 'stock-manager-invoice-verification',
    title: 'Invoice Verification',
    href: paths.stockManager.invoiceVerification,
    icon: 'file-text',
  },
  {
    key: 'stock-manager-inventory-search',
    title: 'Inventory Search',
    href: paths.stockManager.inventorySearch,
    icon: 'magnifying-glass',
  },
  {
    key: 'stock-manager-stock-transfers',
    title: 'Stock Transfers',
    href: paths.stockManager.stockTransfers,
    icon: 'arrows-left-right',
  },
] satisfies NavItemConfig[];

export const superAdminNavItems = [
  { key: 'admin-dashboard', title: 'Dashboard', href: paths.superAdmin.dashboard, icon: 'chart-pie' },
  { key: 'admin-companies', title: 'Companies', href: paths.superAdmin.companies, icon: 'buildings' },
  {
    key: 'admin-subscriptions',
    title: 'Subscription Plans',
    href: paths.superAdmin.subscriptionPlans,
    icon: 'package',
  },
  { key: 'admin-currencies', title: 'Currencies', href: paths.superAdmin.currencies, icon: 'currency-dollar' },
] satisfies NavItemConfig[];

export const salesNavItems = [
  { key: 'sales-dashboard', title: 'Dashboard', href: paths.salesman.dashboard, icon: 'chart-pie' },
  { key: 'sales-parties', title: 'Parties', href: paths.salesman.parties, icon: 'users' },
  { key: 'sales-sales', title: 'Sales', href: paths.salesman.sales, icon: 'currency-dollar' },
  { key: 'sales-purchases', title: 'Purchases', href: paths.salesman.purchases, icon: 'shopping-bag' },
  { key: 'sales-payments', title: 'Payment In', href: paths.salesman.paymentIn, icon: 'credit-card' },
  { key: 'sales-expenses', title: 'Expenses', href: paths.salesman.expenses, icon: 'bank' },
] satisfies NavItemConfig[];
