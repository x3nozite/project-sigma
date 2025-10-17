import SignIn from "./components/SignInPage";
import CreateAccount from "./components/CreateAccountPage";
import AppWithRouter from "./App";
import { createBrowserRouter } from "react-router-dom";



export const router = createBrowserRouter([
    { path: "/", element: <AppWithRouter /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/create-acc", element: <CreateAccount /> },
]);