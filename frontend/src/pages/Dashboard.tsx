import EmployeeStatsCard from "../components/dashboard/EmployeeStatsCard";
import TiktokStatsCard from "../components/dashboard/TiktokStatsCard";
import FedexStatsCard from "../components/dashboard/FedexStatsCard";
import GeneralStatsCard from "../components/dashboard/GeneralStatsCard";

function Dashboard() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
      <h1 className="font-bold text-2xl shrink-0">Dashboard</h1>
      
      {/* 2-COLUMN LAYOUT */}
      <div className="flex-1 flex flex-row gap-2 min-h-0 w-full">
        
        {/* LEFT COLUMN (Takes 2/3 of the width) */}
        <div className="flex-[2] flex flex-col gap-2 h-full">
          
          <div className="shrink-0">
            <EmployeeStatsCard />
          </div>

          <div className="shrink-0">
            <TiktokStatsCard />
          </div>

          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <h1 className="text-xl font-bold flex items-center shrink-0">
              {currentMonth} Summary
            </h1>
            <div className="flex-1 min-h-full">
              <GeneralStatsCard />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Takes 1/3 of the width, pushes to the top) */}
        <div className="flex-[1] flex flex-col items-center justify-center min-h-0 h-full">
          {/* The FedEx/Printer card goes here. 
              It will stretch from the top to the bottom on the right side. */}
          <FedexStatsCard />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;