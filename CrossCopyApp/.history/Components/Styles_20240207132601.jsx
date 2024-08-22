import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    position: 'relative',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  topView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottomView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1.5,
  },
  header: {
    color: '#66ffff',
    fontSize: 40,
    marginBottom: 15,
    marginTop: 45,
    fontWeight: '800',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    textShadowColor: 'rgba(0, 234, 255, 0.1)',
  },
  subHeader: {
    color: 'white',
    margin: 0,
    padding: 0,
    fontSize: 13,
    fontWeight: '300',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  input: {
    margin: 7,
    padding: 10,
    width: '80%',
    backgroundColor: '#404757',
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 4,

    // For placeholder styles, you'll need to use the `placeholderTextColor` prop directly on the TextInput component
  },
  button: {
    margin: 7,
    padding: 10,
    width: 260,
    // borderWidth: 1,
    borderRadius: 4,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 0,
    shadowColor: 'rgba(0, 234, 255, 0.1)',
    shadowOpacity: 1,
    backgroundColor: '#rgb(26,26,26)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: '#fff',
    height: 42,
  },

  text: {
    color: '#fff',
  },

  rectRight: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
});
