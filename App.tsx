import "react-native-gesture-handler";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { Provider } from "./utils";
import { Routes } from "./Routes";

export default function App() {

  const theme = {
    ...DefaultTheme,
    dark: true,
    version: 3,
    colors: {
      ...DefaultTheme.colors,
      primary: "purple",
      background: "black",
      text: "white",
    },
  };

  return (
    <Provider>
      <PaperProvider theme={theme}>
        <Routes />
      </PaperProvider>
    </Provider>
  );
}
