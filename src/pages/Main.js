import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const Main = ({ navigation }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('books')
      .then(data => {
        const book = JSON.parse(data);
        setBooks(book);
      });
  }, []);

  const onNewBook = () => {
    navigation.navigate('Book');
  };

  const onBookEdit = (bookId) => {
    const book = books.find(item => item.id === bookId);
    navigation.navigate('Book', { book: book, isEdit: true });
  };

  const onBookDelete = async (bookId) => {
    const newBooks = books.filter(item => item.id !== bookId);
    await AsyncStorage.setItem("books", JSON.stringify(newBooks));

    setBooks(newBooks);
  };

  const onBookRead = async (bookId) => {
    const newBooks = books.map(item => {
      if (item.id === bookId) {
        item.read = !item.read;
      }
      return item;
    });

    await AsyncStorage.setItem("books", JSON.stringify(newBooks));
  };

  return (
    <View style={ styles.container }>
      <View style={ styles.toolBox }>
        <Text style={ styles.title }>
          Lista de Leitura
        </Text>
        <TouchableOpacity
          style={ styles.toolboxButton }
          onPress={ onNewBook }
        >
          <Icon
            name="add"
            style={ styles.icon }
            color="#fff"
            size={ 14 }
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={ books }
        keyExtractor={ item => item.id }
        renderItem={ ({ item }) => (
          <View style={ styles.itemsContainer }>
            <TouchableOpacity
              style={ styles.itemButton }
              onPress={ () => onBookRead(item.id) }
            >
              <Text style={ [styles.itemText, item.read ? styles.itemRead : ''] }>{ item.title }</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ styles.editButton }
              onPress={ () => onBookEdit(item.id) }
            >
              <Icon
                name="create"
                style={ styles.icon }
                color="#2ecc71"
                size={ 14 }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={ styles.deleteButton }
              onPress={ () => onBookDelete(item.id) }
            >
              <Icon
                name="delete"
                style={ styles.icon }
                color="#e74c3c"
                size={ 14 }
              />
            </TouchableOpacity>
          </View>
        ) }
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 20
  },
  toolBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  toolboxButton: {
    backgroundColor: '#3498db',
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  },
  title: {
    fontSize: 16,
    color: '#3498db',
  },
  itemText: {
    fontSize: 16,
    color: '#000'
  },
  itemButton: {
    flex: 1
  },
  editButton: {

  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  deleteButton: {

  },
  itemRead: {
    textDecorationLine: 'line-through',
    color: '#95a5a6'
  }
});

export {
  Main
};