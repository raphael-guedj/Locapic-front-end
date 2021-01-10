import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View } from "react-native";
import { ListItem } from "react-native-elements";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const InterestScreen = (props) => {
  return (
    <View style={styles.container}>
      {props.interet.map((interet, i) => (
        <ListItem
          containerStyle={styles.list}
          key={i}
          bottomDivider
          onPress={() => {
            var interetFilter = props.interet.filter(
              (item) => item.title !== interet.title
            );
            props.POIStore(interetFilter);
          }}
        >
          <ListItem.Content>
            <ListItem.Title style={{ fontWeight: "bold", color: "#223843" }}>
              {interet.title}
            </ListItem.Title>
            <ListItem.Subtitle>{interet.description}</ListItem.Subtitle>
          </ListItem.Content>
          <FontAwesome name="map-pin" style={styles.iconSend} />
        </ListItem>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    marginTop: 35,
  },
  list: {
    backgroundColor: "#fff0ad",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  iconSend: {
    fontSize: 25,
    color: "#eb4d4b",
    marginHorizontal: 15,
  },
});

function mapStateToProps(state) {
  console.log("state", state.Interets);
  return { interet: state.Interets };
}

function mapDispatchToProps(dispatch) {
  return {
    POIStore: function (interet) {
      dispatch({ type: "interetadd", interet });
      // console.log("dispatch", interet);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InterestScreen);
