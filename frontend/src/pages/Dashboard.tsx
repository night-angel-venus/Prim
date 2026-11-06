import EmployeeStatsCard from "../components/dashboard/EmployeeStatsCard";
import TiktokStatsCard from "../components/dashboard/TiktokStatsCard";
import FedexStatsCard from "../components/dashboard/FedexStatsCard";
import GeneralStatsCard from "../components/dashboard/GeneralStatsCard";

function Dashboard() {


  return (
    <div className="grid gap-2">


      <h1 className="text-xl font-bold">Dashboard</h1>



      {/* COMPONENTS */}

      <div>
        <EmployeeStatsCard />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="grid gap-2 col-span-2 h-full">

          <TiktokStatsCard /> 
          <GeneralStatsCard />
        </div>

        <div className="h-full">
          <FedexStatsCard />
        </div>
      </div>

    </div>
  )
}

export default Dashboard