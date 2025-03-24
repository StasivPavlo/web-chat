import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const serverURL = 'http://localhost:3000';

export const socket = io(serverURL, {
  auth: {
    token: localStorage.getItem('accessToken'),
  },
  autoConnect: false,
});
