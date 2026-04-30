import z from 'zod';
import type { NotificationResponse } from './notificationResponse';

export type NotificationTableRowType = NotificationResponse;

export type RootKeys = keyof NotificationTableRowType;
export type NotificationTableRowKeys = RootKeys;

export const notificationColumnFiltersKeys: Set<NotificationTableRowKeys> = new Set([] as const);

export const notificationSortableColumnKeys = ['createdAt', 'updatedAt'] as const satisfies NotificationTableRowKeys[];

export const notificationQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  size: z.coerce.number().int().min(5).max(50).catch(10),
  sort: z.enum(notificationSortableColumnKeys).catch('updatedAt'),
  order: z.enum(['asc', 'desc']).catch('desc'),
  search: z.string().trim().catch(''),
});

export type NotificationTableQueryParams = z.infer<typeof notificationQueryParamsSchema>;
export type RequiredNotificationTableQueryParams = NotificationTableQueryParams;

export const notificationDefaultQuery: RequiredNotificationTableQueryParams = {
  page: 1,
  size: 10,
  sort: 'updatedAt',
  order: 'desc',
  search: '',
};

export type NotificationPageQuery = z.infer<typeof notificationQueryParamsSchema>;
