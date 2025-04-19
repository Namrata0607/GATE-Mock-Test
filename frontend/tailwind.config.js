// tailwind.config.js
export default {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // ✅ adjust based on your folder structure
    ],
    theme: {
      extend: {
        backgroundImage: {
          'deep-blue': 'linear-gradient(to right, #082d69, #0e3c88, #235bbf)',
        },
      },
    },
    plugins: [],
  }
  