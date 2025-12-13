/**
 * Core Feature Definition
 * 
 * This file defines the core feature without importing the feature-loader
 * to avoid circular dependencies.
 */

import type { Feature } from './services/plugin-registry';
import { eventBus } from './services/events';
import { container } from './services/container';

export const coreFeature: Feature = {
  id: 'core',
  name: 'Core Infrastructure',
  version: '1.0.0',
  dependencies: [],
  services: [
    { name: 'EventBus', factory: () => eventBus, singleton: true },
    { name: 'Container', factory: () => container, singleton: true },
  ],
  components: {
    ErrorBoundary: () => import('@/components/core/common/ErrorBoundary'),
    ProtectedRoute: () => import('@/components/core/common/ProtectedRoute'),
    PWAInstallPrompt: () => import('@/components/core/common/PWAInstallPrompt'),
    Landing: () => import('@/pages/Landing'),
    Install: () => import('@/pages/Install'),
    Index: () => import('@/pages/Index'),
  },
  routes: [
    { path: '/', component: 'Landing', protected: false },
    { path: '/install', component: 'Install', protected: false },
    { path: '/app', component: 'Index', protected: true },
  ],
  hooks: {
    useMobile: () => import('@/components/core/hooks/useMobile'),
    useToast: () => import('@/components/core/hooks/useToast'),
  },
  initialize: async () => console.log('[CoreFeature] Initialized'),
  cleanup: async () => console.log('[CoreFeature] Cleaned up'),
};
