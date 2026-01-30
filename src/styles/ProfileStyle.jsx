import { StyleSheet } from 'react-native';
import colors from '../assets/colors';
import globalStyles from '../assets/globalStyles';

export const profileStyle = StyleSheet.create({
  body: {
    backgroundColor: colors.lightGrey,
    width: '100%',
    height: '100%'
  },
  profileImage: {
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  buddy: { 
    position: 'absolute',
    width: 150, 
    height: 150, 
    zIndex: 100,
    position: 'relative',
    marginTop: 50,
    marginBottom: 50
  },
  headingTextAlign: {
    marginLeft: 25
  },
  profileHeadingText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 40,
    marginTop: 15,
    marginBottom: 0
  },
  profileSubText: {
    fontWeight: '400',
    color: 'black',
    fontSize: 20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'center',
    alignItems: 'center',
    height: '100%',
    margin: 0,
  },
  modalContent: {
    backgroundColor: colors.offWhite,
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 5,
  },
  textInput:{
    backgroundColor: colors.white,
    borderRadius: 10,
    color: colors.black
  },
  pickerInput:{
    backgroundColor: colors.white,
    color: colors.black
  },
  goalsDisplayContainer:{
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    padding: 20,
    width: '100%',
    color: colors.black
  },
  modalHeaderText:{
    color: colors.black,
    fontSize: 30
  },
  goalsEditorContainer:{
    gap: 10, 
    top: 10, 
    padding:40,
    alignSelf: 'center',
    width: '80%',
    borderColor: colors.white,
    backgroundColor: colors.white,
    borderWidth:2,
    borderRadius: 20
  },
  profileButton:{
    padding: 10,
    backgroundColor: colors.red,
    borderRadius: 10,
  }
});
