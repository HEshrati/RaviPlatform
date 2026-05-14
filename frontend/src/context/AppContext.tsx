"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

/* ================= TYPES ================= */

export interface User {
  id: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  avatar?: string;
  role?: string;
  isProfileComplete?: boolean;
  isTestTaken?: boolean;
  city?: string;
  telegram_id?: string;
  telegram_username?: string;
}

export interface AppState {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  city: string | null;
  paymentSuccess: boolean;
  isProfileComplete: boolean;
  isTestTaken: boolean;
}

type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_CITY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PAYMENT_SUCCESS"; payload: boolean };

/* ================= HELPERS ================= */

function computeProfileComplete(
  user: User | null,
  city: string | null,
): boolean {
  if (!user) return false;
  const hasName = !!user.name?.trim();
  const hasCity = !!(city || user.city);
  if (user.isProfileComplete === true) return true;
  return hasName && hasCity;
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now() - 30_000;
  } catch {
    return true;
  }
}

function readInitialStateFromStorage(): Pick<
  AppState,
  "user" | "city" | "isLoggedIn" | "isProfileComplete" | "isTestTaken"
> {
  const empty = {
    user: null,
    city: null,
    isLoggedIn: false,
    isProfileComplete: false,
    isTestTaken: false,
  };

  if (typeof window === "undefined") return empty;

  try {
    // ✅ FIX: واقعاً از localStorage بخون
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedCity = localStorage.getItem("city");

    if (!token || !savedUser) return empty;

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("city");
      document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      console.warn("[Auth] Token expired — cleared storage");
      return empty;
    }

    // ✅ FIX: sync cookie with localStorage for middleware
    document.cookie = `token=${token};path=/;max-age=604800;SameSite=Lax`;

    const user = JSON.parse(savedUser) as User;
    const city = savedCity || user.city || null;
    return {
      user,
      city,
      isLoggedIn: true,
      isProfileComplete: computeProfileComplete(user, city),
      isTestTaken: !!user.isTestTaken,
    };
  } catch {
    return empty;
  }
}

/* ================= INITIAL STATE ================= */

const storedState = readInitialStateFromStorage();

const initialState: AppState = {
  isLoggedIn: storedState.isLoggedIn,
  isLoading: !storedState.isLoggedIn,
  user: storedState.user,
  city: storedState.city,
  paymentSuccess: false,
  isProfileComplete: storedState.isProfileComplete,
  isTestTaken: storedState.isTestTaken,
};

/* ================= REDUCER ================= */

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN": {
      const city = state.city || (action.payload as any).city || null;
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
        user: action.payload,
        city,
        isProfileComplete: computeProfileComplete(action.payload, city),
        isTestTaken: !!action.payload.isTestTaken,
      };
    }
    case "LOGOUT":
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("city");
        sessionStorage.clear();
        document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
      return {
        isLoggedIn: false,
        isLoading: false,
        user: null,
        city: null,
        paymentSuccess: false,
        isProfileComplete: false,
        isTestTaken: false,
      };
    case "SET_USER": {
      const city = state.city || (action.payload as any).city || null;
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
        user: action.payload,
        city,
        isProfileComplete: computeProfileComplete(action.payload, city),
        isTestTaken: !!action.payload.isTestTaken,
      };
    }
    case "SET_CITY":
      return {
        ...state,
        city: action.payload,
        isProfileComplete: computeProfileComplete(state.user, action.payload),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_PAYMENT_SUCCESS":
      return { ...state, paymentSuccess: action.payload };
    default:
      return state;
  }
}

/* ================= CONTEXT ================= */

interface AppContextType {
  state: AppState;
  dispatch?: React.Dispatch<Action>;
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setCity: (city: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

/* ================= PROVIDER ================= */

export default function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // ✅ FIX: واقعاً از localStorage بخون
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedCity = localStorage.getItem("city");

    if (!token || !savedUser) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const loadUserAndCity = (user: any) => {
      dispatch({ type: "SET_USER", payload: user });
      if (!savedCity) {
        fetch(`${API}/api/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((profile) => {
            const city = profile?.city || profile?.data?.city || "";
            if (city) {
              localStorage.setItem("city", city);
              dispatch({ type: "SET_CITY", payload: city });
            }
          })
          .catch(() => {});
      }
    };

    fetch(`${API}/api/users/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          console.warn("[Auth] Token rejected by server — logging out");
          dispatch({ type: "LOGOUT" });
        } else if (res.ok) {
          const user = JSON.parse(savedUser);
          loadUserAndCity(user);
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      })
      .catch(() => {
        console.warn("[Auth] Backend unreachable — using cached auth");
        const user = JSON.parse(savedUser);
        loadUserAndCity(user);
      });
  }, []);

  const value = useMemo<AppContextType>(
    () => ({
      state,
      dispatch,
      user: state.user,
      isLoggedIn: state.isLoggedIn,
      isLoading: state.isLoading,
      login: (user, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
        dispatch({ type: "LOGIN", payload: user });
      },
      logout: () => dispatch({ type: "LOGOUT" }),
      setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "SET_USER", payload: user });
      },
      setCity: (city) => {
        localStorage.setItem("city", city);
        dispatch({ type: "SET_CITY", payload: city });
      },
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* ================= HOOK ================= */

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}

export { AppProvider };
