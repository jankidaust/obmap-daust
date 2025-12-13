/**
 * Graph Feature Definition
 */

import type { Feature } from '@/features/core/services/plugin-registry';

export const graphFeature: Feature = {
  id: 'graph',
  name: 'Graph Visualization',
  version: '1.0.0',
  dependencies: ['core', 'vault'],
  services: [
    { name: 'GraphService', factory: async () => { const { GraphService } = await import('@/services/graph/GraphService'); return new GraphService(); }, singleton: true },
    { name: 'RelationshipMapper', factory: async () => { const { RelationshipMapper } = await import('@/services/graph/RelationshipMapper'); return new RelationshipMapper(); }, singleton: true },
    { name: 'ZipImportService', factory: async () => { const { ZipImportService } = await import('@/services/graph/ZipImportService'); return new ZipImportService(); }, singleton: true },
  ],
  components: {
    NetworkGraph: () => import('@/components/graph/NetworkGraph'),
    NodePanel: () => import('@/components/graph/NodePanel'),
    BacklinksPanel: () => import('@/components/graph/BacklinksPanel'),
    LinkManager: () => import('@/components/graph/LinkManager'),
    DynamicLinkManager: () => import('@/components/graph/DynamicLinkManager'),
    GraphMiniMap: () => import('@/components/graph/GraphMiniMap'),
    MarkdownRenderer: () => import('@/components/graph/MarkdownRenderer'),
    GraphConfigPanel: () => import('@/components/graph/config-panel'),
  },
  routes: [],
  hooks: { useAutoLinks: () => import('@/components/graph/hooks/useAutoLinks') },
  initialize: async () => console.log('[GraphFeature] Initialized'),
  cleanup: async () => console.log('[GraphFeature] Cleaned up'),
};
