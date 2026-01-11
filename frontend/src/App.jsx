import { Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/Mainlayout"
import RatingPage from "./pages/RatingPage"

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<RatingPage />} />
      </Route>
    </Routes>
  )
}
