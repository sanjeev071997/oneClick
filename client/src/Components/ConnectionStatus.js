/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { message } from 'antd';

function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      message.success('You are online');
    }

    function handleOffline() {
      setIsOnline(false);
      message.error('You are offline. Please check your internet connection.');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  return null; 
}

export default ConnectionStatus;
