import React from "react";

const MakeAppointment = () => {
  return (
    <div className="flex justify-center">
    {/* Form Container */}
    <div className="bg-white/70 backdrop-blur-lg shadow-lg p-8 rounded-xl w-full max-w-5xl">
      {/* Employee Info */}
      <h2 className="text-lg font-bold text-red-600 mb-4">Employee Info</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Employee Name</label>
            <input
              type="text"
              placeholder="Enter employee name"
              className="w-full p-[16px] border rounded focus:outline-red-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Select Organization</label>
            <select className="w-full p-[16px] border rounded focus:outline-red-500">
              <option value="">Select Organization</option>
              <option value="kazi">Kazi Farms</option>
              <option value="kf">KF Biotech</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Employee ID</label>
            <input
              type="text"
              placeholder="Enter employee ID"
              className="w-full p-2 border rounded focus:outline-red-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Select Department</label>
            <select className="w-full p-2 border rounded focus:outline-red-500">
              <option value="">Select Department</option>
              <option value="hr">HR</option>
              <option value="it">IT</option>
              <option value="finance">Finance</option>
            </select>
          </div>
          
        </div>

        {/* Partition */}
        <div className="my-6 border-t-2 border-red-300"></div>

        {/* Visitor Info */}
        <h2 className="text-lg font-bold text-red-600 mb-4">Visitor Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block font-semibold mb-1">Visiting Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded focus:outline-red-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Visiting Time</label>
            <input
              type="time"
              className="w-full p-2 border rounded focus:outline-red-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Visiting Person</label>
            <input
              type="text"
              placeholder="Visitor name"
              className="w-full p-2 border rounded focus:outline-red-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone No.</label>
            <input
              type="tel"
              placeholder=""
              className="w-full p-2 border rounded focus:outline-red-500"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder=""
              className="w-full p-2 border rounded focus:outline-red-500"
            />
          </div>
         
          
        </div>

        <div>
  <label className="block font-semibold mb-1">Visiting Purpose</label>
  <textarea
    placeholder="Enter purpose of visit"
    className="w-full p-2 border rounded focus:outline-red-500"
    rows={4} // adjust height
  ></textarea>
</div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            Send Request
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default MakeAppointment;
