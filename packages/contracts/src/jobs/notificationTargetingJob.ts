export type NotificationTargetingJob =
  | {
      type: 'ALL';
    }
  | {
      type: 'COUNTRY';
      countries: string[];
    }
  | {
      type: 'ROLE';
      userIds: string[];
    };
