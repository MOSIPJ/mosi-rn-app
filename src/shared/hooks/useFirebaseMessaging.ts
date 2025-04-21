import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

export const useFirebaseMessaging = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const subscribeTopic = async (topic: string) => {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`${topic} 토픽 구독 성공`);
    } catch (error) {
      console.error(`${topic} 토픽 구독 실패:`, error);
    }
  };

  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getFcmToken();
      }
    };

    const getFcmToken = async () => {
      const token = await messaging().getToken();
      setFcmToken(token);
      console.log('FCM Token:', token);
    };
    // 포그라운드
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('fcm 새 메시지', JSON.stringify(remoteMessage));
    });

    requestUserPermission();

    return unsubscribe;
  }, []);
  // 백그라운드
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('백그라운드 메시지 수신:', remoteMessage);
  });

  return { fcmToken, subscribeTopic };
};
