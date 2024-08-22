// jest.setup.js
require("@testing-library/jest-dom");
global.importMetaEnv = {
  VITE_API_URL:
    "https://australia-southeast1-crosscopy-72ed9.cloudfunctions.net/app", // Mock any other env variables you need
};

// Then in your test files, you can override import.meta.env like this:
Object.defineProperty(global, "importMeta", {
  value: {
    env: global.importMetaEnv,
  },
});
