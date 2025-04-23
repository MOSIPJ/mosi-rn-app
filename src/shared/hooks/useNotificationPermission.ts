import {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

export const useNotificationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const requestPermission = async () => {
    try {
      setIsLoading(true);

      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        setPermissionStatus(enabled);
        return enabled;
      }

      return true; // Android는 기본적으로 true 반환
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkPermission = async () => {
    try {
      setIsLoading(true);
      const authStatus = await messaging().hasPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;
      setPermissionStatus(enabled);
      return enabled;
    } catch (error) {
      console.error('알림 권한 확인 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    permissionStatus,
    isLoading,
    requestPermission,
    checkPermission,
  };
};
