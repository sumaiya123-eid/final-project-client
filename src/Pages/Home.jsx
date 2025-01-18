import About from "../components/About";
import Banner from "../components/Banner";
import Featured from "../components/Featured";
import ForumPage from "./ForumPage";

export default function Home() {
  return (
    <div>
        <Banner></Banner>
        <Featured></Featured>
        <About></About>
    </div>
  )
}
