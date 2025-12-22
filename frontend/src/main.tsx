//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router.tsx'
import { RouterProvider } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext.tsx'
import { UndoRedoProvider } from './context/UndoRedo/UndoRedoProvider.tsx'
import { TourProvider } from '@reactour/tour'
import TourSteps from './components/utilities/TourSteps.tsx'

createRoot(document.getElementById('root')!).render(
  //  <StrictMode>
  <SessionProvider>
    <UndoRedoProvider>
      <TourProvider steps={TourSteps}>
        <RouterProvider router={router} />
      </TourProvider>
    </UndoRedoProvider>
  </SessionProvider>
  //  </StrictMode>,
)
