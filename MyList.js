import { FlatList, StyleSheet, Text, View } from "react-native";

export default function MyFilesList({ files }) {
  const Item = ({ name }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{name}</Text>
    </View>
  );

  return (
    <FlatList
      data={files}
      renderItem={({ item }) => <Item name={item.name} />}
      keyExtractor={(item) => item.name}
    />
  );
}

const styles = StyleSheet.create({

    item: {
      marginVertical: 16,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 18,
    },
  });