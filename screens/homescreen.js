import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = (props) => {
  const [pseudo, setPseudo] = useState("");
  const [inLocal, setInLocal] = useState(false);

  useEffect(() => {
    // AsyncStorage.clear();
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("pseudo");
        if (jsonValue != null) {
          setPseudo(jsonValue);
          setInLocal(true);
        }
      } catch (e) {
        // console.log(e);
        // error reading value
      }
    };
    getData();
  }, []);

  const handleSubmitPseudo = () => {
    props.setPseudoRedux(pseudo);
  };

  let InputStore;

  if (inLocal) {
    InputStore = <Text style={styles.text}>Welcome Back {pseudo} </Text>;
  } else {
    InputStore = (
      <Input
        placeholder="Your Name"
        onChangeText={(e) => setPseudo(e)}
        value={pseudo}
        placeholderTextColor="#eb4d4b"
        leftIcon={<Ionicons name="ios-person" size={30} color="#eb4d4b" />}
        leftIconContainerStyle={{
          marginHorizontal: 5,
        }}
        inputStyle={{
          color: "#fff",
        }}
        inputContainerStyle={{
          borderBottomColor: "#eb4d4b",
        }}
      />
    );
  }

  return (
    <ImageBackground
      source={require("../assets/home_2.jpg")}
      style={styles.image_hero}
    >
      <View style={styles.container}>
        {InputStore}

        <Button
          icon={
            <Ionicons
              name="md-arrow-forward-outline"
              style={styles.icon_arrow}
            />
          }
          title="Go to Map"
          titleStyle={{
            fontSize: 18,
            color: "#ececec",
          }}
          onPress={() => {
            handleSubmitPseudo();
            AsyncStorage.setItem("pseudo", pseudo);
            props.navigation.navigate("Map");
          }}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
  },
  image_hero: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  icon_arrow: {
    fontSize: 28,
    marginHorizontal: 5,
    color: "#eb4d4b",
  },
  text: {
    textAlign: "center",
    fontSize: 25,
    color: "#eb4d4b",
    marginBottom: 17,
    fontWeight: "bold",
    letterSpacing: 4,
    lineHeight: 35,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPseudoRedux: function (pseudo) {
      dispatch({ type: "savePseudo", pseudo });
      // console.log("dispatch", pseudo);
    },
  };
}

export default connect(null, mapDispatchToProps)(HomeScreen);
