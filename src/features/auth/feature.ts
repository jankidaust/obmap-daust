/**
 * Auth Feature Definition
 */

import type { Feature } from '@/features/core/services/plugin-registry';

export const authFeature: Feature = {
  id: 'auth',
  name: 'Authentication',
  version: '1.0.0',
  dependencies: ['core'],
  services: [],
  components: {
    AuthForm: () => import('@/components/auth/AuthForm'),
    PasswordStrengthIndicator: () => import('@/components/auth/PasswordStrengthIndicator'),
    Auth: () => import('@/pages/Auth'),
  },
  routes: [{ path: '/auth', component: 'Auth', protected: false }],
  hooks: { useAuth: () => import('@/components/auth/hooks/useAuth') },
  initialize: async () => console.log('[AuthFeature] Initialized'),
  cleanup: async () => console.log('[AuthFeature] Cleaned up'),
};
