import { useNavigate, Link } from "react-router-dom"
import EmployeeStatsCard from "../components/dashboard/EmployeeStatsCard";
import TiktokStatsCard from "../components/dashboard/TiktokStatsCard";
import FedexStatsCard from "../components/dashboard/FedexStatsCard";
import GeneralStatsCard from "../components/dashboard/GeneralStatsCard";

function Dashboard() {


  return (
    <div>
        

        <h1>Dashboard</h1>
        


        {/* COMPONENTS */}
        <EmployeeStatsCard/>

        <TiktokStatsCard/>

        <FedexStatsCard/>

        <GeneralStatsCard/>

    </div>
  )
}

export default Dashboard