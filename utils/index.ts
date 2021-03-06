export { Context, Provider } from "./state";

export function goLogin(navigation) {
  navigation.navigate("Login");
}

export function goUpload(navigation) {
  navigation.navigate("Upload");
}

export function goMap(navigation) {
  navigation.navigate("Map");
}

export function goRegister(navigation) {
  navigation.navigate("Register");
}

export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return "Email cannot be empty.";
  if (!re.test(email)) return "Ooops! We need a valid email address.";

  return "";
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return "Password cannot be empty.";

  return "";
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return "User name cannot be empty.";

  return "";
};
