exports.handler = async (event, context) => {
  // Check if the method is POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Clear the authentication token cookie
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;',
      },
      body: JSON.stringify({ message: 'Logged out successfully' }),
    };
  } catch (error) {
    console.error('Error logging out:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to log out' }),
    };
  }
};
