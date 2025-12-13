/**
 * Plugin Registry - Central registry for feature registration and lifecycle management
 */

export type ServiceFactory<T = unknown> = () => T | Promise<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentFactory = () => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HookFactory = () => Promise<any>;

export interface RouteConfig {
  path: string;
  component: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
  protected?: boolean;
}

export interface ComponentRegistry {
  [name: string]: ComponentFactory;
}

export interface HookRegistry {
  [name: string]: HookFactory;
}

export interface Feature {
  id: string;
  name: string;
  version: string;
  dependencies?: string[];
  services?: Array<{
    name: string;
    factory: ServiceFactory;
    singleton?: boolean;
  }>;
  components?: ComponentRegistry;
  routes?: RouteConfig[];
  hooks?: HookRegistry;
  initialize?: () => Promise<void>;
  cleanup?: () => Promise<void>;
  enabled?: boolean;
}

export interface FeatureStatus {
  id: string;
  registered: boolean;
  initialized: boolean;
  enabled: boolean;
  error?: string;
}

export class PluginRegistry {
  private features: Map<string, Feature> = new Map();
  private featureStatus: Map<string, FeatureStatus> = new Map();
  private initializedFeatures: Set<string> = new Set();
  private initializationOrder: string[] = [];

  register(feature: Feature): void {
    if (this.features.has(feature.id)) {
      console.warn(`[PluginRegistry] Feature ${feature.id} is already registered. Overwriting.`);
    }

    if (feature.dependencies) {
      for (const depId of feature.dependencies) {
        if (!this.features.has(depId)) {
          console.warn(
            `[PluginRegistry] Feature ${feature.id} depends on ${depId}, but it's not registered yet.`
          );
        }
      }
    }

    this.features.set(feature.id, feature);
    this.featureStatus.set(feature.id, {
      id: feature.id,
      registered: true,
      initialized: false,
      enabled: feature.enabled !== false,
    });

    console.log(`[PluginRegistry] Registered feature: ${feature.id} v${feature.version}`);
  }

  async unregister(featureId: string): Promise<void> {
    const feature = this.features.get(featureId);
    if (!feature) {
      console.warn(`[PluginRegistry] Feature ${featureId} is not registered.`);
      return;
    }

    if (this.initializedFeatures.has(featureId)) {
      if (feature.cleanup) {
        try {
          await feature.cleanup();
        } catch (error) {
          console.error(`[PluginRegistry] Error cleaning up feature ${featureId}:`, error);
        }
      }
      this.initializedFeatures.delete(featureId);
    }

    this.features.delete(featureId);
    this.featureStatus.delete(featureId);
    const index = this.initializationOrder.indexOf(featureId);
    if (index > -1) {
      this.initializationOrder.splice(index, 1);
    }

    console.log(`[PluginRegistry] Unregistered feature: ${featureId}`);
  }

  get(featureId: string): Feature | undefined {
    return this.features.get(featureId);
  }

  getAll(): Feature[] {
    return Array.from(this.features.values());
  }

  getStatus(featureId: string): FeatureStatus | undefined {
    return this.featureStatus.get(featureId);
  }

  getAllStatuses(): FeatureStatus[] {
    return Array.from(this.featureStatus.values());
  }

  enable(featureId: string): void {
    const status = this.featureStatus.get(featureId);
    if (status) {
      status.enabled = true;
    }
  }

  async disable(featureId: string): Promise<void> {
    const feature = this.features.get(featureId);
    const status = this.featureStatus.get(featureId);
    if (!feature || !status) return;

    if (this.initializedFeatures.has(featureId)) {
      if (feature.cleanup) {
        try {
          await feature.cleanup();
        } catch (error) {
          console.error(`[PluginRegistry] Error cleaning up feature ${featureId}:`, error);
        }
      }
      this.initializedFeatures.delete(featureId);
      status.initialized = false;
    }

    status.enabled = false;
  }

  async initialize(featureId: string): Promise<void> {
    const feature = this.features.get(featureId);
    if (!feature) {
      throw new Error(`Feature ${featureId} is not registered`);
    }

    const status = this.featureStatus.get(featureId)!;

    if (!status.enabled) {
      console.log(`[PluginRegistry] Feature ${featureId} is disabled, skipping initialization`);
      return;
    }

    if (this.initializedFeatures.has(featureId)) {
      console.log(`[PluginRegistry] Feature ${featureId} is already initialized`);
      return;
    }

    if (feature.dependencies) {
      for (const depId of feature.dependencies) {
        if (!this.initializedFeatures.has(depId)) {
          await this.initialize(depId);
        }
      }
    }

    try {
      if (feature.initialize) {
        await feature.initialize();
      }
      this.initializedFeatures.add(featureId);
      status.initialized = true;
      status.error = undefined;
      this.initializationOrder.push(featureId);
      console.log(`[PluginRegistry] Initialized feature: ${featureId}`);
    } catch (error) {
      status.error = error instanceof Error ? error.message : String(error);
      console.error(`[PluginRegistry] Failed to initialize feature ${featureId}:`, error);
      throw error;
    }
  }

  async initializeAll(): Promise<void> {
    const features = Array.from(this.features.values());
    const enabledFeatures = features.filter((f) => this.featureStatus.get(f.id)?.enabled !== false);
    const sorted = this.topologicalSort(enabledFeatures);

    for (const feature of sorted) {
      if (!this.initializedFeatures.has(feature.id)) {
        await this.initialize(feature.id);
      }
    }
  }

  async cleanup(featureId: string): Promise<void> {
    const feature = this.features.get(featureId);
    if (!feature) return;

    if (!this.initializedFeatures.has(featureId)) {
      return;
    }

    try {
      if (feature.cleanup) {
        await feature.cleanup();
      }
      this.initializedFeatures.delete(featureId);
      const status = this.featureStatus.get(featureId);
      if (status) {
        status.initialized = false;
      }
      console.log(`[PluginRegistry] Cleaned up feature: ${featureId}`);
    } catch (error) {
      console.error(`[PluginRegistry] Error cleaning up feature ${featureId}:`, error);
      throw error;
    }
  }

  async cleanupAll(): Promise<void> {
    const reversed = [...this.initializationOrder].reverse();
    for (const featureId of reversed) {
      await this.cleanup(featureId);
    }
  }

  private topologicalSort(features: Feature[]): Feature[] {
    const sorted: Feature[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (feature: Feature) => {
      if (visiting.has(feature.id)) {
        console.warn(`[PluginRegistry] Circular dependency detected involving ${feature.id}`);
        return;
      }
      if (visited.has(feature.id)) {
        return;
      }

      visiting.add(feature.id);

      if (feature.dependencies) {
        for (const depId of feature.dependencies) {
          const dep = this.features.get(depId);
          if (dep) {
            visit(dep);
          }
        }
      }

      visiting.delete(feature.id);
      visited.add(feature.id);
      sorted.push(feature);
    };

    for (const feature of features) {
      if (!visited.has(feature.id)) {
        visit(feature);
      }
    }

    return sorted;
  }

  getAllRoutes(): RouteConfig[] {
    const routes: RouteConfig[] = [];
    for (const feature of this.features.values()) {
      if (feature.routes && this.featureStatus.get(feature.id)?.enabled !== false) {
        routes.push(...feature.routes);
      }
    }
    return routes;
  }

  getAllComponents(): Map<string, ComponentFactory> {
    const components = new Map<string, ComponentFactory>();
    for (const feature of this.features.values()) {
      if (feature.components && this.featureStatus.get(feature.id)?.enabled !== false) {
        for (const [name, factory] of Object.entries(feature.components)) {
          components.set(name, factory);
        }
      }
    }
    return components;
  }

  getAllHooks(): Map<string, HookFactory> {
    const hooks = new Map<string, HookFactory>();
    for (const feature of this.features.values()) {
      if (feature.hooks && this.featureStatus.get(feature.id)?.enabled !== false) {
        for (const [name, factory] of Object.entries(feature.hooks)) {
          hooks.set(name, factory);
        }
      }
    }
    return hooks;
  }
}

// Singleton instance
export const pluginRegistry = new PluginRegistry();
