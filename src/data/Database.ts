import { ScylloClient } from "scyllo";

import { Globals } from "../globals";
import { Logger } from "../lib/logger";
import { Calendar } from "../types/Calendar";
import { Task } from "../types/Task";
import { User } from "../types/User";
import { UserCalendarEntry } from "../types/UserCalendarEntry";

export const DataBase = new ScylloClient<{ users: User; tasks: Task; user_calendar_entry: UserCalendarEntry; calendars: Calendar }>({
    client: {
        contactPoints: [Globals.dbHost + ":" + Globals.dbPort],
        keyspace: Globals.dbKeySpace,
        localDataCenter: Globals.dbDatacenter, 
    },
});

export const initDatabase = async () => {
    await DataBase.createTable("users", true, {
        user_id: { type: "bigint"},
        username: { type: "text" },
        password: { type: "text "},
        email: { type: "text" },
        permissions: { type: "bigint" },
    }, "user_id");

    await DataBase.createIndex("users", "users_by_email", "email");
    
    await DataBase.createTable("calendars", true, {
        calendar_id: { type: "bigint" },
        name: { type: "text"}
    }, "calendar_id");

    await DataBase.createTable("tasks", true, {
        task_id: {type: "bigint"},
        calendar_id: { type: "text" },
        complete: { type: "boolean" },
        name: { type: "text" },
        description: { type: "text" },
        day: { type: "timestamp" },
    }, "task_id");

    await DataBase.createIndex("tasks", "tasks_by_callendar_id", "calendar_id");
    
    await DataBase.createTable("user_calendar_entry", true, {
        calendar_id: { type: "bigint" },
        user_id: { type: "text" }
    }, ["calendar_id", "user_id"]);

    Logger.info("Created tables!");
};

