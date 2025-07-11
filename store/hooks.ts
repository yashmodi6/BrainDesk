/**
 * File: store/hooks.ts
 * Description: Provides typed versions of useDispatch and useSelector for Redux Toolkit.
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

/**
 * useAppDispatch
 * Custom hook to access the typed dispatch function.
 * Ensures actions dispatched are type-checked against AppDispatch.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * useAppSelector
 * Custom hook to access Redux state with full type safety.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;