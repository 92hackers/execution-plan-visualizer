/**
 * Diagram interfaces
 */

import { Metric, BufferLocation } from "./enums";

export interface IDiagramViewOptions {
  metric: Metric,
  buffersMetric: BufferLocation,
}