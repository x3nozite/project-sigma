// AppRoot.tsx
import { TourProvider } from "@reactour/tour";
import "./index.css";
import { router } from "./router.tsx";
import { RouterProvider } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext.tsx";
import { UndoRedoProvider } from "./context/UndoRedo/UndoRedoProvider.tsx";

import TourSteps from "./components/utilities/TourSteps.tsx";

function AppRoot() {
  return (
    <SessionProvider>
      <UndoRedoProvider>
        <TourProvider
          steps={TourSteps}
          onClickMask={() => { }}
        >
          <RouterProvider router={router} />
        </TourProvider>
      </UndoRedoProvider>
    </SessionProvider>
  );
}

export default AppRoot;
