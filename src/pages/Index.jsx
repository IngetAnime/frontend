import { Outlet } from "react-router-dom"
import Wrapper from "../component/Wrapper"
import Header from "../component/Header"

export default function IndexPage() {
  return (
    <Wrapper>
      <Header />
      <Outlet />
    </Wrapper>
  )
}