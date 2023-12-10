import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { initialState };
    case "rejected":
      throw new Error("Incorrect email or password.");
    default:
      throw new Error("Unknown action type.");
  }
}

const FAKE_USER = {
  name: "Gemy",
  email: "Gemy@gmail.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

/* eslint-disable */

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    } else {
      dispatch({ type: "rejected" });
    }
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("The AuthContext was used outside the AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
