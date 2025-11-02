import { useState } from "react";
import bell from "../../assets/bell.png";
import face from "../../assets/face.png";
import NormalView from "../../components/NormalView";
import CalendarView from "../../components/CalendarView";

const Home = () => {
  const [activeTab, setActiveTab] = useState("calendar");
    return (
      <div className="p-3 space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row">

        {/* Card 1 */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col  justify-center">
          <div  className="flex flex-row justify-between">
            <h2 className="text-6xl font-bold text-red-600">05</h2>
            <button className="rounded-full bg-pink-100 p-2">
          <img src={bell} alt="face scan" className="h-8 w-11" />
          </button>
          </div>
          
          <p className="mt-3 text-gray-700  text-lg">
            Total Visitors Today
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col  justify-center">
        <div  className="flex flex-row justify-between">
          <h2 className="text-6xl font-bold text-red-600">46</h2>
          <button className="rounded-full bg-pink-100 p-2">
          <img src={face} alt="face scan" className="h-8 w-11" />
          </button>
          
        </div>
          
          <p className="mt-3 text-gray-700  text-lg">
            Total Visitors This Month
          </p>
        </div>

      </div>
       {/* ✅ Tabs Section */}
       <div className="flex gap-4 justify-start">

{/* Normal View Tab */}
<button
  onClick={() => setActiveTab("normal")}
  className={`px-6 py-2 rounded-lg font-semibold border transition
  ${activeTab === "normal"
      ? "bg-red-600 text-white border-red-600"
      : "bg-white text-red-600 border-red-600"
    }`}
>
  Normal View
</button>

{/* Calendar View Tab */}
<button
  onClick={() => setActiveTab("calendar")}
  className={`px-6 py-2 rounded-lg font-semibold border transition
  ${activeTab === "calendar"
      ? "bg-red-600 text-white border-red-600"
      : "bg-white text-red-600 border-red-600"
    }`}
>
  Calendar View
</button>

</div>


{/* ✅ Content Placeholder */}
{activeTab === "normal" && (
<div className="p-6  rounded-xl shadow text-gray-700">
  <NormalView></NormalView>
</div>
)}

{activeTab === "calendar" && (
<div className="p-6 bg-white  rounded-xl shadow text-gray-700">
  <CalendarView></CalendarView>
</div>
)}
    </div>
    );
  };
  
  export default Home;