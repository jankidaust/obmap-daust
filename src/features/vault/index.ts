/**
 * Vault Feature Module
 */

export { vaultFeature } from './feature';

// Components
export { VaultCard } from '@/components/vault/VaultCard';
export { VaultModeSelector } from '@/components/vault/VaultModeSelector';
export { VaultRequiredGate } from '@/components/vault/VaultRequiredGate';
export { VaultComparisonView } from '@/components/vault/VaultComparisonView';
export { VaultBackupPanel } from '@/components/vault/VaultBackupPanel';
export { VaultBackupSettings } from '@/components/vault/VaultBackupSettings';
export { StorageStrategySelector } from '@/components/vault/StorageStrategySelector';
export { ExportToFileSystem } from '@/components/vault/ExportToFileSystem';

// Hooks
export { useVault } from '@/components/vault/hooks/useVault';
export { useVaultEvents } from '@/components/vault/hooks/useVaultEvents';
export { useVaultSync } from '@/components/vault/hooks/useVaultSync';

// Services
export { VaultManager } from '@/services/vault/VaultManager';
export { getVaultManager } from '@/services/vault/VaultManagerSingleton';
export { VaultStorage } from '@/services/vault/VaultStorage';
export { VaultHistory } from '@/services/vault/VaultHistory';
export { VaultBackupService } from '@/services/vault/VaultBackupService';
export { VaultSyncService, vaultSyncService } from '@/services/vault/VaultSyncService';
export { CloudVaultService } from '@/services/vault/CloudVaultService';
export type { VaultData, VaultMetadata, StorageStrategy } from '@/services/vault/types';
