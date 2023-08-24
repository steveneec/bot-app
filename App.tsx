import {useEffect} from 'react';
import {Button, PermissionsAndroid, View} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

export default function App() {
  useEffect(() => {
    PermissionsAndroid.request('android.permission.BLUETOOTH_CONNECT').then(
      res => console.log(res),
    );
  }, []);

  function connect() {
    RNBluetoothClassic.connectToDevice('00:21:13:00:26:7D').then(conn =>
      console.log(conn),
    );
  }

  function sendData() {
    RNBluetoothClassic.writeToDevice('00:21:13:00:26:7D', 'boludo!');
  }

  return (
    <View>
      <Button title="Connect" onPress={connect} />
      <Button title="Send!" onPress={sendData} />
    </View>
  );
}
