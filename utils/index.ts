export { Context, Provider } from "./state";

function goAbout(navigation) {
  navigation.navigate("About");
}

function goLogin(navigation) {
  navigation.navigate("Login");
}

function goUpload(navigation) {
  navigation.navigate("Upload");
}

function goMap(navigation) {
  navigation.navigate("Map");
}

function goRegister(navigation){
  navigation.navigate("Register");
}

export { goAbout, goLogin, goMap, goUpload, goRegister };
