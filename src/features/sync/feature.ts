/**
 * Sync Feature Definition
 */

import type { Feature } from '@/features/core/services/plugin-registry';

export const syncFeature: Feature = {
  id: 'sync',
  name: 'Sync & Offline',
  version: '1.0.0',
  dependencies: ['core', 'vault'],
  services: [
    { name: 'BackgroundSyncService', factory: async () => { const { BackgroundSyncService } = await import('@/services/sync/BackgroundSyncService'); return new BackgroundSyncService(); }, singleton: true },
  ],
  components: {
    AutoSaveIndicator: () => import('@/components/sync/AutoSaveIndicator'),
    OfflineIndicator: () => import('@/components/sync/OfflineIndicator'),
    SyncStatusIndicator: () => import('@/components/sync/SyncStatusIndicator'),
  },
  routes: [],
  hooks: { usePWA: () => import('@/components/sync/hooks/usePWA') },
  initialize: async () => console.log('[SyncFeature] Initialized'),
  cleanup: async () => console.log('[SyncFeature] Cleaned up'),
};
