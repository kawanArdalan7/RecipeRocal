import { StyleSheet } from 'react-native';
import colors from '../assets/colors';

export const signUpStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    marginBottom: 10,
    position: 'absolute',
    width: 120, 
    height: 120, 
    zIndex: 100,
    position: 'relative',
    marginRight: 15
  },
  inputView: {
    backgroundColor: colors.lightGreen,
    borderRadius: 16,
    width: "70%",
    height: 45,
    alignItems: "center"
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.red,
    color: "#000"
  },
  pointHeaderText: {
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 40,
    marginBottom: 10
  },
});
