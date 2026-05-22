export type NotificationTargetingJob =
  | {
      type: 'ALL';
    }
  | {
      type: 'GROUP';
      userIds: string[];
    };
