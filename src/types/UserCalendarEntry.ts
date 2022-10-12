import { Snowflake } from "../lib/snowflake";

export type UserCalendarEntry = {
    user_id: Snowflake;
    calendar_id: Snowflake;
};