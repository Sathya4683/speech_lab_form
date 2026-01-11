import Header from "../components/Header"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#F5ECD7"
    }}>
      <Header />

      {/* This pushes footer down */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}
