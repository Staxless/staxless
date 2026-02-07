/**
 * @file routes/index.ts
 * @description Route aggregator - exports all route modules
 */

export { default as healthRoutes } from './health-router.js';
export { default as apiRoutes } from './api-router.js';
export { default as changelogRoutes } from './changelog-router.js';
