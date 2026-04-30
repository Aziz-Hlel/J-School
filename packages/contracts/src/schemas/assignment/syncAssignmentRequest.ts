import z from 'zod';

export const SyncAssignmentRequestSchema = z
  .array(
    z.object({
      subjectId: z.uuid(),
      teacherId: z.uuid(),
    }),
  )
  .min(1, {
    message: 'At least one assignment is required',
  });

export type SyncAssignmentRequest = z.infer<typeof SyncAssignmentRequestSchema>;
