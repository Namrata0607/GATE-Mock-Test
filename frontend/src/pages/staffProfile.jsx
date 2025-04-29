import React from "react";

function StaffProfile() {
  return (
    <div className="dashboard-container">
      {/* <h1>Staff Profile</h1> */}
        <div className="flex flex-row items-center justify-center h-screen">   
            <div className="m-2 w-1/4 border-2 h-120 justify-left rounded-lg p-4">
                <h1 className="text-4xl font-bold mb-4">Staff Profile</h1>
                    <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
            </div>
            <div className="flex flex-row justify-center items-center border-2 rounded-lg h-120 w-1/4">
                <div className="m-2 w-1/4 border-2 h-20 justify-left rounded-lg p-4">

                </div>
                <div className="m-2 w-1/4 border-2 h-20 justify-left rounded-lg p-4">

                </div>
            </div>
        </div>
    </div>
  );
}

export default StaffProfile;