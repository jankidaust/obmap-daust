/**
 * Profile Feature Definition
 */

import type { Feature } from '@/features/core/services/plugin-registry';

export const profileFeature: Feature = {
  id: 'profile',
  name: 'User Profile',
  version: '1.0.0',
  dependencies: ['core', 'auth'],
  services: [
    { name: 'ApiKeyService', factory: async () => { const { ApiKeyService } = await import('@/services/apikeys/ApiKeyService'); return new ApiKeyService(); }, singleton: true },
  ],
  components: {
    ProfileSettings: () => import('@/components/profile/ProfileSettings'),
    ApiKeyManager: () => import('@/components/profile/ApiKeyManager'),
    AvatarUpload: () => import('@/components/profile/AvatarUpload'),
    FeatureConfigPanel: () => import('@/components/profile/FeatureConfigPanel'),
    Profile: () => import('@/pages/Profile'),
  },
  routes: [{ path: '/profile', component: 'Profile', protected: true }],
  hooks: {},
  initialize: async () => console.log('[ProfileFeature] Initialized'),
  cleanup: async () => console.log('[ProfileFeature] Cleaned up'),
};
