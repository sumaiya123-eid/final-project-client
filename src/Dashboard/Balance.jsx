import LatestBookings from "./LatestBookings";
import StatsCard from "./StatsCard";
import StatsChart from "./StatsChart";


export default function Balance() {
  return (
    <div>
        <StatsCard></StatsCard>
        <LatestBookings></LatestBookings>
        <StatsChart></StatsChart>
    </div>
  )
}
