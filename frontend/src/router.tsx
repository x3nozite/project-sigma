import SignIn from "./components/SignInPage";
import CreateAccount from "./components/CreateAccountPage";
import App from "./App";
import { createHashRouter } from "react-router-dom";



export const router = createHashRouter([
  { path: "/", element: <App /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/create-acc", element: <CreateAccount /> },
]);
