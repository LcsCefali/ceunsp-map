import { useRef, memo, useEffect, useState } from 'react';

import { Camera as ExpoCamera } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '~/global/theme';
import useLocation from '~/hooks/useLocation';
import placeService from '~/services/place';
import useError from '~/hooks/useError';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { IPlaceCreated } from '~/interfaces/place';

const Camera = memo(() => {
  const CameraRef = useRef<ExpoCamera>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [type] = useState<'front' | 'back'>(ExpoCamera.Constants.Type.back);
  const { onError } = useError();

  const location = useLocation();

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      CameraRef.current?.resumePreview();
    })();
  }, []);

  const onPress = async () => {
    try {
      const photo = await CameraRef.current?.takePictureAsync();

      if (!photo?.uri) return;

      const response = await placeService.create(photo, location);

      navigation.navigate('Map', { place: response.data.place });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? error;
      console.log(JSON.stringify(error));
      onError(message);
    }
  };

  return !hasPermission ? (
    <View style={styles.containerNotHasPermission}>
      <Text style={styles.textNotHasPermission}>Precisamos de sua permissão para acessar a camera :(</Text>
    </View>
  ) : isFocused ? (
    <ExpoCamera
      ref={CameraRef}
      ratio='16:9'
      style={styles.camera}
      type={type}
      autoFocus={ExpoCamera.Constants.AutoFocus.on}
    >
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={{ color: 'white' }}>Tire uma foto do seu bloco</Text>
      </TouchableOpacity>
    </ExpoCamera>
  ) : <View />;
});

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  button: {
    flex: 0.1,
    width: '100%',
    height: 50,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.red,
    bottom: 0,
    left: 0
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16
  },

  containerNotHasPermission: { flex: 1, backgroundColor: 'black' },
  textNotHasPermission: { color: 'white' }
});

export default Camera;
