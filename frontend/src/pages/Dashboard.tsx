import EmployeeStatsCard from "../components/dashboard/EmployeeStatsCard";
import TiktokStatsCard from "../components/dashboard/TiktokStatsCard";
import FedexStatsCard from "../components/dashboard/FedexStatsCard";
import GeneralStatsCard from "../components/dashboard/GeneralStatsCard";

function Dashboard() {
  
  return (
    <div className="flex flex-col h-full w-full gap-4 pb-2
    ">
      
      <div className="flex justify-between items-end shrink-0">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <div className="shrink-0">
        <EmployeeStatsCard />
      </div>

      {/* 
        Use a 3x2 Grid. 
        Row 1: TikTok (left, spans 2 cols) and FedEx (right, spans 2 rows).
        Row 2: General Stats (left, spans 2 cols).
      */}
      <div className="flex-1 grid grid-cols-3 grid-rows-[1fr_auto] gap-2 min-h-0">
        
        {/* TikTok (Top Left) */}
        <div className="col-span-2 min-h-0">
          <TiktokStatsCard /> 
        </div>

        {/* FedEx (Right Side, spans both rows) */}
        <div className="col-span-1 row-span-2 min-h-0">
          <FedexStatsCard />
        </div>

        {/* General Stats (Bottom Left) */}
        <div className="col-span-2">
          <GeneralStatsCard />
        </div>

      </div>
    </div>
  )
}

export default Dashboard;