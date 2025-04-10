export const fetchData = async (endpoint) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found. User is not logged in.');
    }
  
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  
    return await response.json();
  };