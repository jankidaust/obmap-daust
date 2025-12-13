/**
 * Features Index
 * 
 * Central registry for all feature modules.
 * This follows Feature-Sliced Design (FSD) architecture.
 */

// Feature definitions
export { coreFeature } from './core';
export { authFeature } from './auth';
export { vaultFeature } from './vault';
export { graphFeature } from './graph';
export { syncFeature } from './sync';
export { profileFeature } from './profile';

// All features array for registration
export const allFeatures = [
  // Note: Import order matters for dependency resolution
  // Core must be first, then features with dependencies
];

// Re-export commonly used items from features
export * from './core';
export * from './auth';
export * from './vault';
export * from './graph';
export * from './sync';
export * from './profile';
