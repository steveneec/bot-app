import Navigation from "./app/navigation";
import { AppContextProvider } from "./app/context/AppContex";
import { Provider } from "react-redux";
import store from "./app/store";

export default function App() {
  /*useEffect(() => {
    PermissionsAndroid.request("android.permission.BLUETOOTH_CONNECT").then(
      (res) => console.log(res)
    );
  }, []);

  function connect() {
    RNBluetoothClassic.connectToDevice("00:21:13:00:26:7D").then((conn) =>
      console.log(conn)
    );
  }

  function sendData() {
    RNBluetoothClassic.writeToDevice("00:21:13:00:26:7D", "boludo!");
  }

  return (
    <View>
      <Button title="Connect" onPress={connect} />
      <Button title="Send!" onPress={sendData} />
    </View>
  );*/
  return (
    <Provider store={store}>
      <AppContextProvider>
        <Navigation />
      </AppContextProvider>
    </Provider>
  );
}
