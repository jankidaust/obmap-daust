/**
 * Vault Feature Module
 */

import type { Feature } from '@/features/core/services/plugin-registry';

export const vaultFeature: Feature = {
  id: 'vault',
  name: 'Vault Management',
  version: '1.0.0',
  dependencies: ['core'],
  services: [
    { name: 'VaultManager', factory: async () => { const { getVaultManager } = await import('@/services/vault/VaultManagerSingleton'); return getVaultManager(); }, singleton: true },
    { name: 'VaultStorage', factory: async () => { const { VaultStorage } = await import('@/services/vault/VaultStorage'); return new VaultStorage(); }, singleton: true },
    { name: 'VaultSyncService', factory: async () => { const { VaultSyncService } = await import('@/services/vault/VaultSyncService'); return new VaultSyncService(); }, singleton: true },
    { name: 'VaultBackupService', factory: async () => { const { VaultBackupService } = await import('@/services/vault/VaultBackupService'); return new VaultBackupService(); }, singleton: true },
  ],
  components: {
    VaultDashboard: () => import('@/pages/VaultDashboard'),
    VaultCard: () => import('@/components/vault/VaultCard'),
    VaultBackupPanel: () => import('@/components/vault/VaultBackupPanel'),
    VaultBackupSettings: () => import('@/components/vault/VaultBackupSettings'),
    VaultComparisonView: () => import('@/components/vault/VaultComparisonView'),
    VaultModeSelector: () => import('@/components/vault/VaultModeSelector'),
    VaultRequiredGate: () => import('@/components/vault/VaultRequiredGate'),
    StorageStrategySelector: () => import('@/components/vault/StorageStrategySelector'),
    ExportToFileSystem: () => import('@/components/vault/ExportToFileSystem'),
  },
  routes: [{ path: '/vaults', component: 'VaultDashboard', protected: true }],
  hooks: {
    useVault: () => import('@/components/vault/hooks/useVault'),
    useVaultSync: () => import('@/components/vault/hooks/useVaultSync'),
    useVaultEvents: () => import('@/components/vault/hooks/useVaultEvents'),
  },
  initialize: async () => console.log('[VaultFeature] Initialized'),
  cleanup: async () => console.log('[VaultFeature] Cleaned up'),
};

export type { VaultData, VaultMetadata, StorageStrategy } from '@/services/vault/types';
