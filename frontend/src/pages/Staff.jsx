import { useState } from 'react';

function StaffUpload() {
  const [access, setAccess] = useState(false);
  const [input, setInput] = useState('');

  const handleCheck = () => {
    if (input === "someSecretPass123") {
      setAccess(true);
    } else {
      alert("Unauthorized");
    }
  };

  if (!access) {
    return (
      <div className="p-10">
        <h2>Staff Access</h2>
        <input type="password" placeholder="Enter Access Code" value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={handleCheck}>Submit</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Staff Upload Questions</h2>
      {/* upload form here */}
    </div>
  );
}

export default StaffUpload;