/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import WebRTC from "react-native-webrtc";
const {RTCPeerConnection, RTCMediaStream, RTCIceCandidate,
  RTCSessionDescription, RTCView, MediaStreamTrack, getUserMedia
} = WebRTC;

export default class rewebrtc extends Component {

  componentDidMount() {
    test();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

let test = () => {
  var configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
  var pc = new RTCPeerConnection(configuration);

  let isFront = true;
  MediaStreamTrack.getSources(sourceInfos => {
    console.log(sourceInfos);
    let videoSourceId;
    for (const i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
        videoSourceId = sourceInfo.id;
      }
    }
    getUserMedia({
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30
        },
        facingMode: (isFront ? "user" : "environment"),
        optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
      }
    }, function (stream) {
      console.log('dddd', stream);
      callback(stream);
    }, logError);
  });

  pc.createOffer(function(desc) {
    pc.setLocalDescription(desc, function () {
      // Send pc.localDescription to peer
    }, function(e) {});
  }, function(e) {});

  pc.onicecandidate = function (event) {
    // send event.candidate to peer
  };
}

let logError = (error) => {
  console.log("Error: ", error);
}

AppRegistry.registerComponent('rewebrtc', () => rewebrtc);
