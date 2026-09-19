import { Route, Routes } from 'react-router-dom'
import './App.css'
import MoviesPage from './pages/MoviesPage'
import ShowtimesPage from './pages/ShowtimesPage'
import { SeatMapPage } from './pages/SeatMapPage'
import { UserProvider } from './context/UserContext'
import { UserSelector } from './components/UserSelector'

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-paper">
        <header className="border-b border-stone/20 bg-surface">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <span className="font-display text-2xl font-semibold text-ink">
              TicketRush
            </span>
            <UserSelector />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Routes>
      <Route path='/' element={<MoviesPage></MoviesPage>}></Route>
      <Route path='/movies/:movieId/showtimes' element={<ShowtimesPage></ShowtimesPage>}></Route>
      <Route path='/showtimes/:showtimeId/seats' element={<SeatMapPage></SeatMapPage>}></Route>
      
    </Routes>
        </main>
      </div>
    </UserProvider>
  );
}

export default App
