import { StyleSheet } from "react-native";
import colors from "../assets/colors";
import globalStyles from "../assets/globalStyles";

export const settingStyle = StyleSheet.create({
  body: {
    backgroundColor: colors.offWhite,
    width: '100%'
  },
  settingsContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.offWhite,
    gap: 10
  },
  buttonsContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    width: '100%'
  },
  pressTopButton: {
    backgroundColor: colors.yellow,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 3,
    width: '80%',
    marginTop: 5
  },
  pressButton: {
    backgroundColor: colors.yellow,
    padding: 20,
    elevation: 3,
    width: '80%'
  },
  pressBottomButton: {
    backgroundColor: colors.yellow,
    padding: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 3,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonText: {
    ...globalStyles.button_text_dark
  }
});
