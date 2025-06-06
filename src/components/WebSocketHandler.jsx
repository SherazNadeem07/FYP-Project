'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../Redux/Slices/notifications/notificationSlice';

export default function WebSocketHandler() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect to WebSocket
    const socket = new WebSocket('ws://your-backend-url/ws');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_MESSAGE') {
        dispatch(addNotification({
          id: Date.now(),
          message: `New message from ${data.sender}`,
          type: 'message'
        }));
      }
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  return null;
}