import "react-native-gesture-handler";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { Provider } from "./utils";
import { Routes } from "./Routes";

export default function App() {

  // const theme = {
  //   ...DefaultTheme,
  //   roundness: 2,
  //   version: 3,
  //   colors: {
  //     ...DefaultTheme.colors,
  //     primary: '#3498db',
  //     secondary: '#f1c40f',
  //     tertiary: '#a1b2c3'
  //   },
  // };

  return (
    <Provider>
      {/* <PaperProvider theme={theme}> */}
      <PaperProvider>
        <Routes />
      </PaperProvider>
    </Provider>
  );
}
