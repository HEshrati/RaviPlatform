"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from "react";

// تعریف User Type
type User = {
  mobileNumber?: string | null;
  role?: string | null;
  name?: string | null;
};

// تعریف State Type
type State = {
  isLoggedIn: boolean;
  isProfileComplete: boolean;
  isTestTaken: boolean;
  isLoading: boolean;
  userCity: string | null;
  paymentSuccess: boolean;
  user: User | null;
};

// تعریف Action Types
type Action = 
  | { type: "LOGIN" }
  | { type: "LOGOUT" }
  | { type: "COMPLETE_PROFILE" }
  | { type: "TAKE_TEST" }
  | { type: "SET_CITY"; payload: string | null }
  | { type: "SET_PAYMENT_SUCCESS"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_STATE"; payload: Partial<State> };

// Initial State
const initialState: State = {
  isLoggedIn: false,
  isProfileComplete: false,
  isTestTaken: false,
  isLoading: true,
  userCity: null,
  paymentSuccess: false,
  user: null,
};

// Reducer Function
function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
      };
    
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        isProfileComplete: false,
        isTestTaken: false,
        userCity: null,
        paymentSuccess: false,
        user: null,
      };
    
    case "COMPLETE_PROFILE":
      return {
        ...state,
        isProfileComplete: true,
      };
    
    case "TAKE_TEST":
      return {
        ...state,
        isTestTaken: true,
      };
    
    case "SET_CITY":
      return {
        ...state,
        userCity: action.payload,
      };
    
    case "SET_PAYMENT_SUCCESS":
      return {
        ...state,
        paymentSuccess: action.payload,
      };
    
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "LOAD_STATE":
      return {
        ...state,
        ...action.payload,
      };
    
    default:
      return state;
  }
}

// ایجاد Context
type AppContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ذخیره state در localStorage
  useEffect(() => {
    try {
      localStorage.setItem("raavi_app_state", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving state to localStorage:", error);
    }
  }, [state]);

  // بارگذاری state از localStorage هنگام لود صفحه
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("raavi_app_state");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: "LOAD_STATE", payload: parsedState });
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
    }
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook برای استفاده از Context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// Helper Functions
export const appActions = {
  login: () => ({ type: "LOGIN" as const }),
  logout: () => ({ type: "LOGOUT" as const }),
  completeProfile: () => ({ type: "COMPLETE_PROFILE" as const }),
  takeTest: () => ({ type: "TAKE_TEST" as const }),
  setCity: (city: string | null) => ({ type: "SET_CITY" as const, payload: city }),
  setPaymentSuccess: (success: boolean) => ({ type: "SET_PAYMENT_SUCCESS" as const, payload: success }),
  setUser: (user: User | null) => ({ type: "SET_USER" as const, payload: user }),
  loadState: (state: Partial<State>) => ({ type: "LOAD_STATE" as const, payload: state }),
};

// useApp hook — wrapper for BottomNav and other components
export function useApp() {
  const { state, dispatch } = useAppContext();
  const logout = () => dispatch(appActions.logout());
  return { state, dispatch, logout };
}
