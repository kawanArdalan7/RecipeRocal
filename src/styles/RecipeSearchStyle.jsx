import { StyleSheet } from 'react-native';
import colors from '../assets/colors';

export const recipeSearchStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchBarContainer: {
    flex: 1, 
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    padding: 0
  },
  searchBarInput: {
    backgroundColor: '#EDEDED'
  },
  searchButton: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    color: "#fff",
    marginLeft: 3,
    marginRight: 3
  },
  flatListContent: {
    justifyContent: "center", 
    alignItems: "center",  
  },
  horizontalFlatList: {
    height: 275,
  },  
  horizontalFlatListContent: {
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 2,
  },  
  modalView: {
    flex: 0,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    top: "25%",
    backgroundColor: "#EFEFEF",
    maxHeight: "75%"
  },
  headerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 35,
    marginBottom: 0,
  },
  detailsContainer: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 35,
    margin: 10,
  },
  modalText: {
    color: colors.black,
  },
  modalHeader: {
    color: colors.black,
    fontWeight: 'bold',
  },
  recommendationheader: {
    marginTop: 5,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    marginTop: 10,
    marginBottom: 10,
    height: 1,
    backgroundColor: 'black',
    color: 'black'
  },
  thickLine: {
    marginTop: 10,
    marginBottom: 10,
    height: 3,
    backgroundColor: 'black',
    color: 'black'
  },
  closeButton: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 50,
    top: 10,
    left: 10,
    padding: 6,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 90,
  },
  backgroundImage: {
    width: '100%',
    height: '35%',
    position: 'absolute',
  },
  manualOuterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // testing color
    // backgroundColor: 'grey',
    // height: '75%'
  },
  manualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // testing color
    // backgroundColor: 'green',
  },
  manualText: {
    // alignSelf: 'center',
    fontSize: 20,
    paddingBottom: 15,
  },
  textItem: {
    color: colors.black,
  },
  button: {
    width: 200,
    height: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },

});
