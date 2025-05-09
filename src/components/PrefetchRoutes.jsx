'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function PrefetchRoutes() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Define route relationships - which routes are likely to be visited from each route
    const routeRelationships = {
      '/': ['/auth/signin', '/auth/signup', '/events/create'],
      '/auth/signin': ['/auth/signup', '/dashboard'],
      '/auth/signup': ['/auth/signin', '/dashboard'],
      '/dashboard': ['/events/create', '/admin'],
      '/events/create': ['/dashboard'],
      '/admin': ['/dashboard'],
      '/gallery': ['/dashboard'],
      '/events/[code]': ['/dashboard', '/gallery'],
      '/capture/[code]': ['/events/[code]', '/gallery']
    };

    // Get the base path without dynamic segments
    const basePath = pathname.split('/').slice(0, 3).join('/');
    
    // Get routes to prefetch based on current path
    const routesToPrefetch = routeRelationships[basePath] || [];

    // Prefetch only the related routes
    routesToPrefetch.forEach(route => {
      router.prefetch(route);
    });
  }, [router, pathname]);

  return null;
} 