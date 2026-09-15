import { Route, Routes } from 'react-router-dom'
import './App.css'
import MoviesPage from './pages/MoviesPage'
import ShowtimesPage from './pages/ShowtimesPage'
import { SeatMapPage } from './pages/SeatMapPage'

function App() {

  return (
    <Routes>
      <Route path='/' element={<MoviesPage></MoviesPage>}></Route>
      <Route path='/movies/:movieId/showtimes' element={<ShowtimesPage></ShowtimesPage>}></Route>
      <Route path='/showtimes/:showtimeId/seats' element={<SeatMapPage></SeatMapPage>}></Route>
      
    </Routes>
      
  )
}

export default App
