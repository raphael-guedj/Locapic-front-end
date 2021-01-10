import React, { useEffect, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { connect } from "react-redux";
import { Button, Overlay, Input, Badge } from "react-native-elements";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import socketIOClient from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

let socket = socketIOClient("https://locapicreactnative.herokuapp.com/");

function MapScreen(props) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [currentLongitude, setCurrentLongitude] = useState(null);
  const [addPOI, setAddPOI] = useState(false);
  const [listPOI, setlistPOI] = useState([]);
  const [dataPOI, setdataPOI] = useState(null);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      Location.watchPositionAsync(
        {
          distanceInterval: 2,
        },
        (location) => {
          setCurrentLatitude(location.coords.latitude);
          setCurrentLongitude(location.coords.longitude);
          socket.emit("localisation", {
            pseudo: props.pseudo,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    })();

    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("POI");
        jsonValue != null && setlistPOI(JSON.parse(jsonValue));
      } catch (e) {
        console.log(e);
        // error reading value
      }
    };
    getData();
  }, []);

  useEffect(() => {
    props.POIStore(listPOI);
    AsyncStorage.setItem("POI", JSON.stringify(listPOI));
  }, [listPOI]);

  useEffect(() => {
    socket.on("localisationtoAll", (localisationData) => {
      let newPosition = [...position];

      newPosition = newPosition.filter(
        (element) => element.pseudo != localisationData.pseudo
      );

      newPosition.push(localisationData);
      setPosition(newPosition);
    });
  }, [position]);

  const handleSubmitPOI = () => {
    setAddPOI(true);
  };

  const ajoutPOI = () => {
    setlistPOI([...listPOI, { ...dataPOI, title, description }]);
    toggleOverlay();
    setTitle("");
    setDescription("");
    setdataPOI(null);
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  if (!currentLatitude || !currentLongitude) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>en attente</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.container}
        initialRegion={{
          latitude: currentLatitude,
          longitude: currentLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => {
          if (addPOI) {
            setdataPOI(e.nativeEvent.coordinate);
            setAddPOI(false);
            toggleOverlay();
          }
        }}
      >
        {position.map((element, i) => {
          // console.log(position);
          return (
            <Marker
              key={element.pseudo}
              coordinate={{
                latitude: element.latitude,
                longitude: element.longitude,
              }}
              title={element.pseudo}
              description="I am here"
              pinColor="red"
              opacity={0.8}
            />
          );
        })}

        {listPOI.map((coords, i) => {
          // console.log("map", coords);
          return (
            <Marker
              key={i}
              coordinate={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
              // title={coords.title}
              // description={coords.description}
              pinColor="blue"
              opacity={0.8}
            >
              <Callout tooltip>
                {/* <View> */}
                <View style={styles.bubble}>
                  <Text style={styles.name}>{coords.title}</Text>
                  <Text style={styles.description}>{coords.description}</Text>
                </View>
                {/* </View> */}
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          flex: 1,
          width: "80%",
          margin: 150,
        }}
      >
        <View>
          <Input
            placeholder="Titre"
            onChangeText={(e) => setTitle(e)}
            value={title}
            inputStyle={{
              color: "#001233",
            }}
          />
          <Input
            placeholder="description"
            onChangeText={(e) => setDescription(e)}
            value={description}
            inputStyle={{
              color: "#001233",
            }}
          />

          <Button
            buttonStyle={{
              backgroundColor: "#eb4d4b",
              paddingVertical: 10,
              marginTop: 20,
            }}
            icon={<Ionicons name="ios-add-circle" style={styles.iconSend} />}
            title="Ajouter POI"
            onPress={() => {
              ajoutPOI();
            }}
          />
        </View>
      </Overlay>

      <Button
        buttonStyle={{ backgroundColor: "#eb4d4b" }}
        icon={<FontAwesome name="map-marker" style={styles.iconSend} />}
        title="Add POI"
        disabled={addPOI}
        onPress={() => {
          handleSubmitPOI();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e5e5",
  },
  iconSend: {
    fontSize: 25,
    color: "#fcfcfc",
    marginHorizontal: 5,
  },
  bubble: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 0.5,
    backgroundColor: "#fcfcfc",
    borderColor: "#ccc",
    padding: 15,
    width: 150,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    paddingBottom: 15,
  },
  locationButton: {
    backgroundColor: "lightgrey",
    borderRadius: 10,
    opacity: 0.8,
  },
  locationButtonCallout: {
    borderRadius: 0,
    opacity: 0.8,
    backgroundColor: "lightgrey",
  },
});

function mapDispatchToProps(dispatch) {
  return {
    POIStore: function (interet) {
      dispatch({ type: "interetadd", interet });
      // console.log("dispatch", interet);
    },
  };
}

function mapStateToProps(state) {
  // console.log(state.Userpseudo);
  return { pseudo: state.Userpseudo };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
