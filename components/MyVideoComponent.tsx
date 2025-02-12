import React, { useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Video, { VideoRef } from 'react-native-video';

const { width, height } = Dimensions.get('window');

interface MyVideoComponentProps {
  onLoad?: (data: any) => void;
}

const MyVideoComponent: React.FC<MyVideoComponentProps> = ({ onLoad }) => {
  const videoRef = useRef<VideoRef>(null);
  const background = require('../assets/addannouncement.mp4');

  const onBuffer = (buffer: any) => {
    console.log('Buffering:', buffer);
  };

  const onError = (error: any) => {
    console.error('Video error:', error);
  };

  return (
    <Video
      source={background}
      ref={videoRef}
      onBuffer={onBuffer}
      onError={onError}
      onLoad={onLoad}
      style={styles.backgroundVideo}
      repeat={true}
      paused={false}
      muted={true}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: "100%",
  },
});

export default MyVideoComponent;
