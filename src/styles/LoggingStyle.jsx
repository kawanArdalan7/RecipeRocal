import { StyleSheet } from 'react-native';
import colors from '../assets/colors';

export const loggingStyle = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pointHeaderText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 40
  },
  pointSubText: {
    color: 'black',
    fontSize: 20
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin:'5%',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
  },
  entryContainer: {
    backgroundColor: colors.lightGreen,
    elevation: 3,
    padding: '5%',
    margin: '5%',
    borderRadius: 20,
    width: '100%',
  },
  entryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 0,
    color: colors.black,
  },
  entryInfo: {
    fontSize: 10,
    marginBottom: 5,
  },
  button: {
    width: 200,
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  text: {
    color: colors.black,
  },
  dateText: {
    color: colors.black,
    fontStyle: 'italic', 
    marginBottom: 5,
  }
});
