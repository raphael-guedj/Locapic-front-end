import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ListItem, Input, Button } from "react-native-elements";
import socketIOClient from "socket.io-client";
import Ionicons from "react-native-vector-icons/Ionicons";

let socket = socketIOClient("http://192.168.1.80:3000");

function ChatScreen(props) {
  const [currentMessage, setCurrentMessage] = useState();
  const [listMessage, setListMessage] = useState([]);

  useEffect(() => {
    socket.on("sendMessageDatatoAll", (messageData) => {
      setListMessage([messageData, ...listMessage]);
    });
    // console.log(listMessage);
  }, [listMessage]);

  let regexSad = /:\(/;
  let regexCool = /:\)/;
  let regexPlay = /:\p/;

  let regexFuck = /fuck+/i;
  let regexEnc = /enculé+/i;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ flex: 1 }}>
          {listMessage.map((list, i) => (
            <ListItem key={i}>
              <ListItem.Content>
                <ListItem.Title style={styles.messagebox}>
                  {list.currentMessage}
                </ListItem.Title>
                <ListItem.Subtitle>{list.pseudo}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
      >
        <Input
          placeholder="Your message"
          onChangeText={(e) => {
            setCurrentMessage(
              e
                .replace(regexSad, "\u2639")
                .replace(regexCool, "\u263A")
                .replace(regexPlay, "\uD83D\uDE1B")
                .replace(regexFuck, "\u2022\u2022\u2022")
                .replace(regexEnc, "\u2022\u2022\u2022")
            );
          }}
          value={currentMessage}
          inputStyle={{
            color: "#001233",
          }}
          errorStyle={{ display: "none" }}
          inputContainerStyle={{
            marginBottom: 10,
          }}
        />
        <Button
          buttonStyle={{ backgroundColor: "#eb4d4b" }}
          icon={<Ionicons name="ios-send" style={styles.iconSend} />}
          title="Send"
          onPress={() => {
            socket.emit("messageData", {
              currentMessage,
              pseudo: props.pseudo,
            });
            setCurrentMessage("");
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    marginTop: 30,
  },
  messagebox: {
    fontWeight: "bold",
    paddingVertical: 5,
  },
  iconSend: {
    fontSize: 25,
    color: "#fcfcfc",
    marginHorizontal: 5,
  },
});

function mapStateToProps(state) {
  // console.log(state.Userpseudo);
  return { pseudo: state.Userpseudo };
}

export default connect(mapStateToProps, null)(ChatScreen);
