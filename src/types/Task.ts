import { Snowflake } from "../lib/snowflake";

export type Task = {
    task_id: Snowflake;
    calendar_id: string;
    name: string;
    day: Date;
    complete: boolean;
    description: string;
}
