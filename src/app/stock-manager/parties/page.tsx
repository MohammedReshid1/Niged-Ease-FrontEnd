'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

export default function PartiesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to suppliers page since stock managers only deal with suppliers
    router.push(paths.stockManager.suppliers);
  }, [router]);

  return null;
} 