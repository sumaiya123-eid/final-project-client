import { Helmet } from "react-helmet-async";
import LatestBookings from "./LatestBookings";
import StatsCard from "./StatsCard";
import StatsChart from "./StatsChart";


export default function Balance() {
  return (
    <div>
      <Helmet>
                    <title>FitConnect | Dashboard | Balance</title>
                  </Helmet>
        <StatsCard></StatsCard>
        <LatestBookings></LatestBookings>
        <StatsChart></StatsChart>
    </div>
  )
}
