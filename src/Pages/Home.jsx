import About from "../components/About";
import Banner from "../components/Banner";
import Featured from "../components/Featured";
import Footer from "../Shared/Footer";
import FeaturedClasses from "./FeaturedClasses";
import ForumPage from "./ForumPage";
import ForumPosts from "./ForumPosts";
import NewsletterSubscription from "./NewsletterSubscription";
import Testimonials from "./Testimonials";
import TrainerSection from "./TrainerSection";

export default function Home() {
  return (
    <div>
        <Banner></Banner>
        <Featured></Featured>
        <About></About>
        <FeaturedClasses></FeaturedClasses>
        <Testimonials></Testimonials>
        <ForumPosts></ForumPosts>
        <NewsletterSubscription></NewsletterSubscription>
        <TrainerSection></TrainerSection>
        <Footer></Footer>
    </div>
  )
}
