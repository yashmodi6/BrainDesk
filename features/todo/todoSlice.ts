/**
 * File: todoSlice.ts
 * Description: Redux slice for managing tasks — add/edit/delete/toggle + storage sync.
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuid } from "uuid";
import { STORAGE_KEYS } from "@/constants/storageKeys";

//
// ─── TYPES ─────────────────────────────────────────────────────────────────────
//

/** A single to-do task object */
export type Task = {
    id: string;
    text: string;
    completed: boolean;
    subject: string;
    priority: string;
    createdAt: string;
    completedAt?: string | null;
    deletedAt?: string | null;
};

/** Task slice state */
type TodoState = {
    tasks: Task[];
};

//
// ─── INITIAL STATE ─────────────────────────────────────────────────────────────
//

const initialState: TodoState = {
    tasks: []
};

//
// ─── ASYNC THUNKS ──────────────────────────────────────────────────────────────
//

/**
 * Loads tasks from AsyncStorage into Redux.
 */
export const loadTasksFromStorage = createAsyncThunk(
    "todo/loadTasks",
    async () => {
        const json = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
        return json ? (JSON.parse(json) as Task[]) : [];
    }
);

//
// ─── STORAGE HELPERS ───────────────────────────────────────────────────────────
//

/**
 * Save all current tasks to AsyncStorage.
 */
const saveTasks = async (tasks: Task[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

//
// ─── REDUX SLICE ───────────────────────────────────────────────────────────────
//

const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        /**
         * Add a new task to the list.
         */
        addTask: (
            state,
            action: PayloadAction<{
                text: string;
                subject: string;
                priority: string;
                createdAt?: string;
            }>
        ) => {
            const newTask: Task = {
                id: uuid(),
                text: action.payload.text,
                subject: action.payload.subject,
                priority: action.payload.priority,
                completed: false,
                createdAt: action.payload.createdAt ?? new Date().toISOString(),
                completedAt: null,
                deletedAt: null
            };
            state.tasks.push(newTask);
            saveTasks(state.tasks);
        },

        /**
         * Edit text, priority, and subject of an existing task.
         */
        editTask: (
            state,
            action: PayloadAction<{
                id: string;
                text: string;
                priority: string;
                subject: string;
            }>
        ) => {
            const task = state.tasks.find(t => t.id === action.payload.id);
            if (task) {
                task.text = action.payload.text;
                task.priority = action.payload.priority;
                task.subject = action.payload.subject;
                saveTasks(state.tasks);
            }
        },

        /**
         * Toggle task completion and update `completedAt` timestamp.
         */
        toggleTask: (state, action: PayloadAction<string>) => {
            const task = state.tasks.find(t => t.id === action.payload);
            if (task) {
                task.completed = !task.completed;
                task.completedAt = task.completed
                    ? new Date().toISOString()
                    : null;
                saveTasks(state.tasks);
            }
        },

        /**
         * Permanently delete a task by ID.
         */
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(t => t.id !== action.payload);
            saveTasks(state.tasks);
        },

        /**
         * Merge external task list into state, avoiding duplicates by ID.
         */
        mergeTasks: (state, action: PayloadAction<Task[]>) => {
            const incomingTasks = action.payload.filter(
                t =>
                    t &&
                    typeof t.id === "string" &&
                    typeof t.text === "string" &&
                    typeof t.subject === "string" &&
                    typeof t.priority === "string" &&
                    typeof t.createdAt === "string"
            );

            const existingIds = new Set(state.tasks.map(t => t.id));
            const newTasks = incomingTasks.filter(t => !existingIds.has(t.id));

            state.tasks = [...state.tasks, ...newTasks];
            saveTasks(state.tasks);
        },

        /**
         * Clear all tasks from memory and disk.
         */
        clearTasks(state) {
            state.tasks = [];
            AsyncStorage.removeItem(STORAGE_KEYS.TASKS);
        }
    },

    //
    // ─── ASYNC REDUCERS ──────────────────────────────────────────────────────────
    //

    extraReducers: builder => {
        builder.addCase(loadTasksFromStorage.fulfilled, (state, action) => {
            state.tasks = action.payload;
        });
    }
});

//
// ─── EXPORTS ───────────────────────────────────────────────────────────────────
//

export const {
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    mergeTasks,
    clearTasks
} = todoSlice.actions;

export default todoSlice.reducer;
