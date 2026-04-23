import { Image, ImageStyle } from 'react-native';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';


interface CatImageProps {
  containerStyle?: StyleProp<ImageStyle>;
}
export default function CatImage({ containerStyle }: CatImageProps) {
  containerStyle = containerStyle || defaultStyle.container;

  return (
    <Image
      source={{ uri: 'https://usagif.com/wp-content/uploads/gifs/dancing-cat-33.gif' }}
      style={containerStyle}
    />
  )
}

const defaultStyle = StyleSheet.create({
  container: {
    width: 400,
    height: 400
  }
})