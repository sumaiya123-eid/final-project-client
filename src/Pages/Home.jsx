import About from "../components/About";
import Banner from "../components/Banner";
import Featured from "../components/Featured";
import Footer from "../Shared/Footer";
import ForumPage from "./ForumPage";
import ForumPosts from "./ForumPosts";
import Testimonials from "./Testimonials";

export default function Home() {
  return (
    <div>
        <Banner></Banner>
        <Featured></Featured>
        <About></About>
        <Testimonials></Testimonials>
        <ForumPosts></ForumPosts>
        <Footer></Footer>
    </div>
  )
}
