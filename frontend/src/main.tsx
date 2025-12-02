//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router.tsx'
import { RouterProvider } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext.tsx'
import { UndoRedoProvider } from './context/UndoRedo/UndoRedoProvider.tsx'

createRoot(document.getElementById('root')!).render(
  //  <StrictMode>
  <SessionProvider>
    <UndoRedoProvider>
      <RouterProvider router={router} />
    </UndoRedoProvider>
  </SessionProvider>
  //  </StrictMode>,
)
