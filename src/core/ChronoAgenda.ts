import { log } from "@drantaz/f-log";
import { JobData } from "../types";
import { v4 as uuidv4 } from "uuid";
import Agenda, { Job } from "agenda";
import JobHandler from "../jobs/handler";

export default class ChronoAgenda {
  private agenda: Agenda;
  private logging: boolean;

  constructor(db: string, logging: boolean) {
    this.agenda = new Agenda({
      db: {
        address: db,
        collection: "chrono_jobs",
      },
      defaultConcurrency: 30,
      maxConcurrency: 100,
    });
    this.logging = logging;
    (async () => {
      try {
        await this.agenda.start();
        this.logging &&
          log("Chrono job with agenda has started", "info", false);
      } catch (err) {
        this.logging && log(err.message, "error", false);
      }
    })();
  }

  /**
   * Adds a job to the agenda
   * @name name of the job
   * @payload payload of the job
   * @when when to run the job
   */
  scheduleTask = async (
    name: string,
    payload: JobData,
    when: Date | string,
    callback: Function
  ) => {
    await this.agenda.start();
    const jobName = `${name}-${uuidv4()}`;
    this.agenda.define(jobName, JobHandler.manageTask(callback));
    const record =
      payload.chronology === "interval"
        ? await this.agenda.every(
            typeof when === "object" ? when.toISOString() : when,
            jobName,
            payload,
            { skipImmediate: true }
          )
        : await this.agenda.schedule(when, jobName, payload);
    return record;
  };

  /**
   * Rejuvenate jobs
   */
  rejuvenate = async () => {};
}
