import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainMenu from "./pages/MainMenu.tsx"
import Solitaire from "./pages/Solitaire.tsx"
import Spider from "./pages/Spider.tsx"
import './App.css'
import { LanguageProvider } from './LanguageContext.tsx'

function App() {
  return ( 
    <LanguageProvider>
      <BrowserRouter basename="/mini-games">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/solitaire" element={<Solitaire />} />
          <Route path="/spider" element={<Spider />}/>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )

}

export default App
