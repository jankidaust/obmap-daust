/**
 * Core Feature Module
 */

// Feature definition
export { coreFeature } from './feature';

// Components
export { ErrorBoundary } from '@/components/core/common/ErrorBoundary';
export { ProtectedRoute } from '@/components/core/common/ProtectedRoute';
export { PWAInstallPrompt, PWAStatusBadge } from '@/components/core/common/PWAInstallPrompt';

// Hooks
export { useIsMobile } from '@/components/core/hooks/useMobile';
export { useToast } from '@/components/core/hooks/useToast';

// Services
export { eventBus, EventType } from './services/events';
export { container, ServiceIds } from './services/container';
export { pluginRegistry } from './services/plugin-registry';
export type { Feature, RouteConfig, FeatureStatus } from './services/plugin-registry';
export { initializeFeatureLoader, getFeatureRoutes, isFeatureEnabled, getAllFeatures } from './services/feature-loader';
