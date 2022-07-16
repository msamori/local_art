export { Context, Provider } from "./state";

function goAbout(navigation) {
  navigation.navigate("About");
}

function goHome(navigation) {
  navigation.navigate("Home");
}

function goLogin(navigation) {
  navigation.navigate("Login");
}

function goUpload(navigation) {
  navigation.navigate("Upload");
}

export { goAbout, goHome, goLogin, goUpload };
