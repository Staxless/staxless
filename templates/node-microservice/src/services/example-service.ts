/**
 * @file services/example-service.ts
 * @description Example service layer demonstrating business logic separation.
 * Services contain business logic and coordinate between models and external systems.
 */

import { Example, type ExampleType } from '../models/example-model.js';

/**
 * Example service for managing example entities
 */
export const ExampleService = {
  /**
   * Create a new example with validation
   */
  async create(data: { name: string; description?: string }): Promise<ExampleType> {
    // Add business logic validation here
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    return Example.create({
      name: data.name.trim(),
      description: data.description?.trim(),
      status: 'active',
    });
  },

  /**
   * Get example by ID
   */
  async getById(id: string): Promise<ExampleType | null> {
    if (!id) {
      throw new Error('ID is required');
    }
    return Example.findOne({ _id: id });
  },

  /**
   * Get all active examples
   */
  async getActive(): Promise<ExampleType[]> {
    return Example.find({ status: 'active' });
  },

  /**
   * Update example status
   */
  async updateStatus(id: string, status: 'active' | 'inactive') {
    const existing = await Example.findOne({ _id: id });
    if (!existing) {
      throw new Error('Example not found');
    }
    return Example.update(id, { status });
  },

  /**
   * Soft delete by setting status to inactive
   */
  async deactivate(id: string) {
    return this.updateStatus(id, 'inactive');
  },

  /**
   * Hard delete
   */
  async delete(id: string) {
    const existing = await Example.findOne({ _id: id });
    if (!existing) {
      throw new Error('Example not found');
    }
    return Example.delete(id);
  },
};
