import type { LocalizedString, NotificationJob } from '@repo/contracts/jobs/notificationJob';
import axios from 'axios';
import { ENV } from './config/ENV';

interface INotificationProvider {
  sendToAllUsers(baseNotificationPayload: BaseNotificationPayload): OneSignalPayload[];
  sendToCountry(baseNotificationPayload: BaseNotificationPayload, countries: string[]): OneSignalPayload[];
  sendToUser(baseNotificationPayload: BaseNotificationPayload, userIds: string[]): OneSignalPayload[];
  sendToRole(baseNotificationPayload: BaseNotificationPayload, userIds: string[]): OneSignalPayload[];
}

type OneSignalPayload = {
  app_id: string;
  target_channel: string;
  headings: LocalizedString;
  data: LocalizedString;
  contents: LocalizedString;
  included_segments?: string[];
  include_external_user_ids?: string[];
  send_after?: Date;
  filters?: {
    field: 'country';
    relation: '=';
    value: string;
  }[];
};

type BaseNotificationPayload = {
  app_id: string;
  target_channel: string;
  headings: LocalizedString;
  data: LocalizedString;
  contents: LocalizedString;
};

export class NotificationProvider implements INotificationProvider {
  private oneSignalBaseUrl = 'https://onesignal.com/api/v1';
  private oneSignalUrl = `${this.oneSignalBaseUrl}/notifications`;

  private validateOneSignalConfig = async () => {
    try {
      await axios.get(`${this.oneSignalBaseUrl}/apps/${ENV.ONE_SIGNAL_APP_ID}`, {
        headers: {
          Authorization: `Basic ${ENV.ONE_SIGNAL_APP_SECRET}`,
        },
      });

      console.log('✅ SUCCESS : OneSignal configuration is valid');
    } catch (error) {
      console.error('❌ ERROR : OneSignal configuration is INVALID');
      throw error;
    }
  };

  constructor() {
    this.validateOneSignalConfig();
  }

  sendToAllUsers(baseNotificationPayload: BaseNotificationPayload): OneSignalPayload[] {
    return [
      {
        ...baseNotificationPayload,
        included_segments: ['All'],
      },
    ];
  }

  sendToCountry(baseNotificationPayload: BaseNotificationPayload, countries: string[]): OneSignalPayload[] {
    return countries.map((country) => {
      return {
        ...baseNotificationPayload,
        filters: [
          {
            field: 'country',
            relation: '=',
            value: country,
          },
        ],
      };
    });
  }

  sendToRole(baseNotificationPayload: BaseNotificationPayload, userIds: string[]): OneSignalPayload[] {
    const userBatches = [];
    for (let i = 0; i < userIds.length; i += 1000) {
      userBatches.push(userIds.slice(i, i + 1000));
    }
    return userBatches.map((userBatch) => {
      return {
        ...baseNotificationPayload,
        include_external_user_ids: userBatch,
      };
    });
  }

  sendToUser(baseNotificationPayload: BaseNotificationPayload, userIds: string[]): OneSignalPayload[] {
    const userBatches = [];
    for (let i = 0; i < userIds.length; i += 1000) {
      userBatches.push(userIds.slice(i, i + 1000));
    }
    return userBatches.map((userBatch) => {
      return {
        ...baseNotificationPayload,
        include_external_user_ids: userBatch,
      };
    });
  }

  send = async (payload: NotificationJob) => {
    const baseNotificationPayload = {
      app_id: ENV.ONE_SIGNAL_APP_ID,
      target_channel: 'push',
      headings: payload.titles,
      data: payload.data,
      contents: payload.contents,
    };

    let payloads: OneSignalPayload[];
    switch (payload.targeting.type) {
      case 'ALL':
        payloads = this.sendToAllUsers(baseNotificationPayload);
        break;
      case 'GROUP':
        payloads = this.sendToUser(baseNotificationPayload, payload.targeting.userIds);
        break;
    }

    await Promise.all(payloads.map(this.sendNotification));
  };

  sendNotification = async (payload: OneSignalPayload) => {
    // throw new Error('Not implemented yet!');
    try {
      await axios.post(
        this.oneSignalUrl,
        {
          ...payload,
          // small_icon: 'ic_notification',
          // large_icon:
          //   'https://fastly.picsum.photos/id/237/200/200.jpg?hmac=zHUGikXUDyLCCmvyww1izLK3R3k8oRYBRiTizZEdyfI',
          // big_picture:
          //   'https://fastly.picsum.photos/id/237/200/200.jpg?hmac=zHUGikXUDyLCCmvyww1izLK3R3k8oRYBRiTizZEdyfI',

          // ios_attachments: {
          //   video: 'https://d23gfwidwdh7y.cloudfront.net/events/globe_test_ios_video_noti.mp4',
          // },
          mutable_content: true,
        },
        {
          headers: {
            Authorization: `Bearer ${ENV.ONE_SIGNAL_APP_SECRET}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('❌ ERROR : Notification job failed', error);
      throw error;
    }
  };
}
