import React, { useEffect, useState } from "react";

function StaffProfile() {
  const [staffDetails, setStaffDetails] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const token = localStorage.getItem("staffToken");
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await fetch("http://localhost:3000/api/staff/getStaffDetails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch staff details");
        }

        const data = await response.json();
        setStaffDetails(data);
        setEditForm({ name: data.name, email: data.email });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStaffDetails();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("staffToken");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch("http://localhost:3000/api/staff/staffLogout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        const role = localStorage.getItem("userToken") ? "user" : "staff";
        if (role === "user") {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userName");
        } else if (role === "staff") {
          localStorage.removeItem("staffToken");
          localStorage.removeItem("staffName");
        }
        window.location.href = "/staffLogin";
      } else {
        alert("Logout failed: " + data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
    setEditForm({ name: staffDetails.name, email: staffDetails.email });
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("staffToken");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch("http://localhost:3000/api/staff/editStaffProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (response.ok) {
        setStaffDetails(data);
        setEditMode(false);
        alert("Profile updated successfully!");
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  if (!staffDetails) {
    return <div className="text-gray-600 text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl flex flex-col md:flex-row p-6 gap-6">
        {/* Profile Info */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 font-[Sans]">Staff Profile</h1>
          </div>
          <div className="space-y-4 text-gray-700">
            {editMode ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 block mb-1" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-3 py-1 lg:w-25 text-sm lg:text-lg font-semibold font-[sans] bg-white p-2 
                        rounded transition ease-in-out duration-400 border-3 bg-gradient-to-r from-blue-900 
                        via-blue-800 to-blue-900 text-white border-blue-900 cursor:pointer hover:text-gray-300"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="px-4 py-2 w-25 text-lg font-semibold font-[sans] bg-white text-gray-800 rounded
              transition ease-in-out duration-400 border-3 border-gray-500  hover:bg-gray-200 hover:text-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-medium">{staffDetails.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-medium">{staffDetails.email}</p>
                </div>
                <div className="flex gap-2 mt-8">
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 lg:w-25 text-sm lg:text-lg font-semibold font-[sans] bg-white p-2 
                        rounded transition ease-in-out duration-400 border-3 bg-gradient-to-r from-blue-900 
                        via-blue-800 to-blue-900 text-white border-blue-900 cursor:pointer hover:text-gray-300"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className={`px-3 py-1 lg:w-25 text-sm lg:text-lg font-semibold font-[sans] bg-white p-2 
                        rounded transition ease-in-out duration-400 border-3 bg-gradient-to-r from-blue-900 
                        via-blue-800 to-blue-900 text-white border-blue-900 cursor:pointer hover:text-gray-300${
                      editMode
                        ? "bg-gray-400 hover:bg-gray-500"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Placeholder or Avatar / Profile Card */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="border border-gray-300 rounded-lg p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-semibold">
              {staffDetails.name?.charAt(0).toUpperCase()}
            </div>
            <p className="mt-4 text-gray-700 font-medium">
              {staffDetails.name}
            </p>
            <p className="text-sm text-gray-500">{staffDetails.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffProfile;