export const PIPELINE = [
  'new',
  'brief_confirmed',
  'in_production',
  'internal_qa',
  'client_review',
  'revision',
  'delivered',
  'closed'
] as const;

export type PipelineStatus = (typeof PIPELINE)[number];

export function isOverdue(deadline: string | null, status: string): boolean {
  if (!deadline) return false;
  if (['delivered', 'closed'].includes(status)) return false;
  return new Date(deadline).getTime() < Date.now();
}
