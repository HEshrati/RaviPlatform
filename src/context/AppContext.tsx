"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

// 1. تعریف تایپ‌ها
type State = {
  isLoggedIn: boolean;
  isProfileComplete: boolean;
  isTestTaken: boolean;
  userCity: string | null;
};

type Action =
  | { type: "LOGIN" }
  | { type: "LOGOUT" }
  | { type: "COMPLETE_PROFILE" }
  | { type: "TAKE_TEST" }
  | { type: "SET_CITY"; payload: string }
  | { type: "RESTORE_STATE"; payload: State };

// 2. وضعیت اولیه
const initialState: State = {
  isLoggedIn: false,
  isProfileComplete: false,
  isTestTaken: false,
  userCity: null,
};

// 3. ساخت کانتکست
const AppContext = createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

// 4. ردیوسر
function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        isProfileComplete: false,
        isTestTaken: false,
        userCity: null,
      };
    case "COMPLETE_PROFILE":
      return { ...state, isProfileComplete: true };
    case "TAKE_TEST":
      return { ...state, isTestTaken: true };
    case "SET_CITY":
      return { ...state, userCity: action.payload };
    case "RESTORE_STATE":
      return action.payload;
    default:
      return state;
  }
}

// 5. پروایدر
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // بارگذاری state از localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("raavi_app_state");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: "RESTORE_STATE", payload: parsedState });
      } catch (error) {
        console.error("Error loading state from localStorage:", error);
      }
    }
  }, []);

  // ذخیره state در localStorage
  useEffect(() => {
    localStorage.setItem("raavi_app_state", JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// 6. هوک اختصاصی
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
