import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainMenu from "./pages/MainMenu.tsx"
import Solitaire from "./pages/Solitaire.tsx"
import './App.css'

function App() {

  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/solitaire" element={<Solitaire />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
