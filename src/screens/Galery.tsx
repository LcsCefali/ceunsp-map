import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { SectionList, Text } from 'react-native';
import { TextInput, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import GridImageView from 'react-native-grid-image-viewer';
import { View } from '~/components/Themed';
import theme from '~/global/theme';
import useRequest from '~/hooks/useRequest';
import { IPlace } from '~/interfaces/map';
import placeService from '~/services/place';

import ceunspImg from '~/assets/ceunsp.jpg';

const Galery = memo(() => {
  const isFocused = useIsFocused();
  const { response: places, isLoading } = useRequest<IPlace[]>(() => placeService.list(), [isFocused]);

  const [searchValue, setSearchValue] = useState('');

  const route = useRoute();
  const placeToViewAll = route.params?.place;

  const placesFiltered = useMemo(() => {
    if (!!searchValue)
      return (
        places
          ?.filter(value => value.name.toLowerCase().includes(searchValue.toLowerCase()))
          ?.map(place => ({ title: place.name, data: place.pictures })) ?? []
      );

    return places?.map(place => ({ title: place.name, data: place.pictures })) ?? [];
  }, [places, searchValue]);

  const onChangeText = useCallback(value => setSearchValue(value), []);
  const onClearText = useCallback(() => setSearchValue(''), []);

  const keyExtractor = useCallback(item => item, []);
  const renderSectionHeader = useCallback(({ section }) => <Text style={styles.title}>{section.title}</Text>, []);
  const renderSectionFooter = useCallback(({ section: { data } }) => <GridImageView data={data} />, []);

  const renderFooter = useCallback(() => {
    return placesFiltered?.length === 0 ? (
      <View style={styles.notFound}>
        <Text style={styles.textNotFound}>Sem registros para sua busca...</Text>
      </View>
    ) : null;
  }, [placesFiltered]);

  useEffect(() => {
    if (!!placeToViewAll) {
      setSearchValue(placeToViewAll.name);
    }
  }, [placeToViewAll]);

  if (isLoading) {
    return (
      <ImageBackground style={styles.loadingView} source={ceunspImg}>
        <ActivityIndicator color='#fff' size={50} />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={ceunspImg}>
      <SectionList
        style={styles.list}
        sections={placesFiltered}
        renderItem={() => null}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          <View style={styles.searchContent}>
            <TextInput
              style={styles.inputSearch}
              placeholder='Pesquisar...'
              value={searchValue}
              onChangeText={onChangeText}
            />
            <FontAwesome size={30} name='close' onPress={onClearText} color='#fff' />
          </View>
        }
      />
    </ImageBackground>
  );
});

export default Galery;

export const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
    height: '100%'
  },
  searchContent: {
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 10
  },
  inputSearch: {
    width: '90%',
    height: 40,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 20,
    paddingLeft: 10
  },
  notFound: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  textNotFound: {
    color: theme.colors.text,
    fontSize: 18
  },
  loadingView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.navy_blue
  },
  title: {
    paddingLeft: 4,
    paddingVertical: 10,
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold'
  }
});
