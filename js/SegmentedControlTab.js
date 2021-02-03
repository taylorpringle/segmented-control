/**
 * @flow
 */

'use strict';

import * as React from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';

import type {FontStyle} from './types';

type Props = $ReadOnly<{|
  value: string | number | Object,
  tintColor?: ?string,
  onSelect: () => void,
  selected: boolean,
  enabled: boolean,
  fontStyle?: FontStyle,
  activeFontStyle?: FontStyle,
  appearance?: 'dark' | 'light' | null,
  backgroundColor:'#636366',
  activeBackgroundColor:'#a9a9a9',
  width: number,
|}>;

const SCREEN_WIDTH = Dimensions.get('window').width;

function isBase64(str) {
  const regex = /^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/;
  return str && regex.test(str);
}

export const SegmentedControlTab = ({
  onSelect,
  value,
  enabled,
  selected,
  tintColor,
  fontStyle = {},
  activeFontStyle = {},
  appearance,
  width
}: Props): React.Node => {
  const {color: textColor, fontSize, fontFamily, fontWeight} = fontStyle;

  const {
    color: activeColor,
    fontSize: activeFontSize,
    fontFamily: activeFontFamily,
    fontWeight: activeFontWeight,
  } = activeFontStyle;

  const getColor = () => {
    if (textColor) {
      return textColor;
    }
    if (tintColor) {
      return 'white';
    }
  };
  const color = getColor();

  const activeStyle = {
    ...styles.activeText,
    fontFamily: activeFontFamily || fontFamily,
    fontSize: activeFontSize || fontSize,
    color: activeColor || color,
    fontWeight: activeFontWeight || fontWeight,
    backgroundColor: '#636366' || '#a9a9a9'
  };

  const idleStyle = {
    color,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
  };

  const containerStyle = {
    ...styles.default,
  };

  //Assign type for image
  var image = value.replace(/\s/g, '');
  image = image.toLowerCase() + '.png';
  const label = value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <TouchableOpacity
      style={[idleStyle, selected && activeStyle], styles.container}
      disabled={!enabled}
      onPress={onSelect}>
      <View style={[containerStyle, selected && activeStyle]}>
          <Image source={{uri:image}} style={styles.segmentImage} />
          <Text style={[idleStyle, selected && activeStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, borderRadius: 5 },
  default: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 5,
    padding: 5
  },
  segmentImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
