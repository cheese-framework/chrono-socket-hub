import { RepeatOptions } from "bullmq";
import { Express } from "express";

export interface ChronoSocketConfig {
  agent?: "agenda" | "bullmq";
  /** database for agenda or bullmq */
  db?: string;
  redisPassword?: string;
  /** Allow rejuvenation of redis jobs */
  allowBullMQRejuvenation?: boolean;
  socketPath?: string;
  origin?: string;
  methods?: string[];
  logging?: boolean;
  app?: Express;
  /**
   * This option is optimized for scenarios where you want to send an event only if the client is still connected at the time of sending. If the client disconnects before receiving the event, the event won't be sent. This can be useful for certain real-time updates or notifications that aren't critical.
   */
  volatile?: boolean;
}

export interface JobData {
  when: string | Date;
  agent: "agenda" | "bullmq";
  type: "task" | "message";
  reference: string;
  chronology: "schedule" | "interval";
  callback?: string;
  data?: any;
}

export interface RedisConcurrency {
  when: string | Date;
  repeatInterval?: RepeatOptions;
}
