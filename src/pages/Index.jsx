import { Outlet } from "react-router-dom"
import Wrapper from "../component/Wrapper"
import Header from "../component/Header"
import Footer from "../component/Footer"

export default function IndexPage() {
  return (
    <Wrapper>
      <Header />
      <Outlet />
      <Footer />
    </Wrapper>
  )
}