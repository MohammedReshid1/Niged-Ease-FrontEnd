import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Buildings as BuildingsIcon } from '@phosphor-icons/react/dist/ssr/Buildings';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { Package as PackageIcon } from '@phosphor-icons/react/dist/ssr/Package';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { ShoppingBag as ShoppingBagIcon } from '@phosphor-icons/react/dist/ssr/ShoppingBag';
import { Bank as BankIcon } from '@phosphor-icons/react/dist/ssr/Bank';
import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';
import { Storefront as StorefrontIcon } from '@phosphor-icons/react/dist/ssr/Storefront';
import { UserGear as UserGearIcon } from '@phosphor-icons/react/dist/ssr/UserGear';
import { ChartLine as ChartLineIcon } from '@phosphor-icons/react/dist/ssr/ChartLine';
import { FileText as FileTextIcon } from '@phosphor-icons/react/dist/ssr/FileText';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { ArrowsLeftRight as ArrowsLeftRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowsLeftRight';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  'user-gear': UserGearIcon,
  users: UsersIcon,
  buildings: BuildingsIcon,
  package: PackageIcon,
  'currency-dollar': CurrencyDollarIcon,
  'shopping-bag': ShoppingBagIcon,
  bank: BankIcon,
  'credit-card': CreditCardIcon,
  'storefront': StorefrontIcon,
  'chart-line': ChartLineIcon,
  'file-text': FileTextIcon,
  'magnifying-glass': MagnifyingGlassIcon,
  'arrows-left-right': ArrowsLeftRightIcon,
} as Record<string, Icon>;
