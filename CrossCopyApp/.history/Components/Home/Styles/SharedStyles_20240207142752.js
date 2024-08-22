import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    position: 'relative',
  },
  subContainer: {
    flex: 1,
    borderWidth: 1,
    margin: 8,
    borderColor: '#f70404',
    backgroundColor: '#252525',
    background: '#252525',

    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 0,
    marginBottom: 50,
  },
  mainContent: {
    flex: 1,
    padding: 8,
    background: '#252525',
  },
  bottomContainer: {
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#9b9999',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  bottomText: {
    flex: 1,
    color: '#66ffff',
    fontWeight: '700',
    fontSize: 16,
  },

  bottomButton: {
    backgroundColor: '#66ffff',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
  },

  buttonText: {
    color: '#5e5e5e',
  },

  fullView: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,

    // justifyContent: 'center',
  },
});
