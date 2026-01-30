import { StyleSheet } from 'react-native';

const signInStyle = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    backgroundColor: "white", 
    padding: 20, 
    borderRadius: 10, 
    shadowColor: "black", 
    shadowOffset: {
      width: 0,
      height: 2
    }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5
  },
  label: {
    fontSize: 16, 
    marginBottom: 5, 
    fontWeight: "bold", 
    color: "black",
  },
  input: {
    height: 40, 
    borderColor: "#DDD", 
    borderWidth: 1, 
    marginBottom: 15, 
    padding: 10, 
    borderRadius: 5, 
    color: "black"
  },
  image: {
    width: 200, 
    height: 200, 
    alignSelf: "center", 
    marginBottom: 50,
  },
  errorText: {
    color: "red", 
    marginBottom: 10,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  // inputView: {
  //   width:"80%",
  //   backgroundColor:"#3AB4BA",
  //   borderRadius:25,
  //   height:50,
  //   marginBottom:20,
  //   justifyContent:"center",
  //   padding:20
  //   },
  //   inputText:{
  //   height:50,
  //   color:"white"
  //   }, 
  //   forgotAndSignUpText:{
  //     color:"white",
  //     fontSize:11
  //     },
 });

 export default signInStyle;
 