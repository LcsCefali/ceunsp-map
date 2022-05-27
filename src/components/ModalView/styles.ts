import { StyleSheet } from 'react-native';
import theme from '~/global/theme';

export const styles = StyleSheet.create({
  cardModal: {
    backgroundColor: '#fff',
    width: '100%',
    height: 500,
    borderRadius: 4
  },
  img: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  scrollView: {
    backgroundColor: theme.colors.navy_blue
  },
  touchableOpacity: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 7,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  imgItens: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    backgroundColor: theme.colors.navy_blue
  },
  imgItensTxt: {
    marginRight: 12,
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: theme.colors.text,
    padding: 4,
    color: theme.colors.navy_blue,
    fontWeight: 'bold'
  }
});
