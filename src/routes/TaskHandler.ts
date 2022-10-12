import { Type } from "@sinclair/typebox";
import { Router } from "express";

import { DataBase } from "../data/Database";
import { generateSnowflake } from "../lib/snowflake";
import { AuthentificatedRequest, useAuth } from "../middlewares/useAuth";
import { useValidation } from "../middlewares/useValidation";
import { Task } from "../types/Task";

export const TaskHandler = Router();

TaskHandler.get("/calendar/:calendar_id", useAuth, async (req: AuthentificatedRequest, res) => {

    const user = req.user;
    if(!user) return res.status(400).send("Invalid user!!");

    const userCalendarEntry = await DataBase.selectOneFrom("user_calendar_entry", "*", { user_id: user.user_id, calendar_id: req.params.calendar_id });

    if(!userCalendarEntry && !(user.permissions & 1)) return res.status(403).send("Access denied!!");

    const tasks = await DataBase.selectFrom("tasks", "*", { calendar_id: req.params.calendar_id});

    return res.status(200).json(tasks);
});

TaskHandler.get("/task/:task_id", useAuth, async (req: AuthentificatedRequest, res) => {

    const user = req.user;
    if(!user) return res.status(400).send("Invalid user!");

    const task = await DataBase.selectOneFrom("tasks", "*", { task_id: req.params.task_id });

    if(!task) return res.status(404).send("Task not found!");

    const userCalendarEntry = await DataBase.selectOneFrom("user_calendar_entry", "*", { user_id: user.user_id, calendar_id: task.calendar_id });
    if(!userCalendarEntry && !(user.permissions & 1)) return res.status(403).send("Access denied!");

    return res.status(200).json(task);

});

const taskSchema = Type.Object({
    name: Type.String(),
    desciption: Type.String(),
    day: Type.String(),
    calendar_id: Type.Number()
});


TaskHandler.post("/task", useAuth, useValidation(taskSchema, { body: true }), async (req: AuthentificatedRequest, res) => {
    const user = req.user;
    if(!user) return res.status(400).send("Invalid user!");

    const userCalendarEntry = await DataBase.selectOneFrom("user_calendar_entry", "*", { user_id: user.user_id, calendar_id: req.body.calendar_id });
    if(!userCalendarEntry && !(user.permissions & 1)) return res.status(403).send("Access denied!");

    const newTask: Task = {
        task_id: generateSnowflake(),
        day: new Date(req.body.day),
        description: req.body.desciption,
        name: req.body.name,
        calendar_id: req.body.calendar_id,
        complete: false
    };  

    await DataBase.insertInto("tasks", newTask);

    return res.status(200).json(newTask);
});





