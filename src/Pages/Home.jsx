import { Helmet } from "react-helmet-async";
import About from "../components/About";
import Banner from "../components/Banner";
import Featured from "../components/Featured";
import FeaturedClasses from "./FeaturedClasses";
import ForumPosts from "./ForumPosts";
import NewsletterSubscription from "./NewsletterSubscription";
import Testimonials from "./Testimonials";
import TrainerSection from "./TrainerSection";

export default function Home() {
  return (
    <div>
      <Helmet>
                    <title>FitConnect | Home</title>
                  </Helmet>
        <Banner></Banner>
        <Featured></Featured>
        <About></About>
        <FeaturedClasses></FeaturedClasses>
        <Testimonials></Testimonials>
        <ForumPosts></ForumPosts>
        <NewsletterSubscription></NewsletterSubscription>
        <TrainerSection></TrainerSection>
    </div>
  )
}
