import React from "react";



function StaffDashboard() {
  
const branches = [
    { name: "Computer Science"},
    { name: "Mechanical Engineering" },
    { name: "Civil Engineering" },
    { name: "Electrical Engineering" },
    
];

return (
    <div className="dashboard-container">
        <h1>Staff Dashboard</h1>
        <div className="cards-container">
            {branches.map((branch, index) => (
                <div key={index} className="card">
                    <img src={branch.logo} alt={`${branch.name}`} />
                    <h2 className="card-title">{branch.name}</h2>
                </div>
            ))}
        </div>
    </div>
);
}

export default StaffDashboard;