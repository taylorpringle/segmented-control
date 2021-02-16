/**
 * @flow
 */

'use strict';

import * as React from 'react';

import {
  Animated,
  Easing,
  I18nManager,
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Text
} from 'react-native';

import type {SegmentedControlProps} from './types';
import {SegmentedControlTab} from './SegmentedControlTab';
import {SegmentsSeparators} from './SegmentsSeparators';

/**
 * SegmentedControl
 * iOS 13 Style UISegmentedControl Component for Android and Web
 */

const SCREEN_WIDTH = Dimensions.get('window').width;
const CustomSegmentedControl = ({
  style,
  onChange,
  onValueChange,
  enabled = true,
  selectedIndex,
  values,
  tintColor,
  backgroundColor,
  fontStyle,
  activeFontStyle,
  appearance,
}: SegmentedControlProps): React.Node => {
  const [segmentWidth, setSegmentWidth] = React.useState(0);
  const animation = React.useRef(new Animated.Value(0)).current;

  const handleChange = (index: number) => {
    if(selectedIndex == index) {
      index = null;
    }
    // mocks iOS's nativeEvent
    const event: any = {
      nativeEvent: {
        value: values[index],
        selectedSegmentIndex: index,
      },
    };
    onChange && onChange(event);
    onValueChange && onValueChange(values[index]);
  };

  React.useEffect(() => {
    if (animation && segmentWidth) {
      let isRTL = I18nManager.isRTL ? -segmentWidth : segmentWidth;
      Animated.timing(animation, {
        toValue: isRTL * (selectedIndex || 0),
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [animation, segmentWidth, selectedIndex]);

  return (
    <View
      style={[
        styles.default,
        style,
        backgroundColor && {backgroundColor},
        !enabled && styles.disabled,

      ]}
      onLayout={({
        nativeEvent: {
          layout: {width},
        },
      }) => {
        const newSegmentWidth = values.length ? width / values.length : 0;
        if (newSegmentWidth !== segmentWidth) {
          animation.setValue(newSegmentWidth * (selectedIndex || 0));
          setSegmentWidth(newSegmentWidth);
        }

      }}>
      <View style={styles.segmentsContainer}>
        <FlatList
          data={values}
          numColumns={3}
          scrollEnabled={false}
          columnWrapperStyle={{alignItems:'flex-start'}}
          renderItem={({ item, index }) => (
            <View style={{flex: 0.33}}>
              <SegmentedControlTab
                enabled={enabled}
                selected={selectedIndex === index}
                key={index}
                value={item}
                tintColor={tintColor}
                fontStyle={fontStyle}
                activeFontStyle={activeFontStyle}
                onSelect={() => {
                  handleChange(index);
                }}
              />
            </View>
          )}
          keyExtractor={item => item}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    backgroundColor: '#a9a9a9',
    borderRadius: 9,
    //width: SCREEN_WIDTH*0.9,
    justifyContent: 'center',
    flex: 1,
    //height: 200,
  },
  darkControl: {
    backgroundColor: '#a9a9a9',
  },
  disabled: {
    opacity: 0.4,
  },
  segmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    elevation: 5,
    backgroundColor: 'transparent',
    zIndex: 99,
    justifyContent: 'center'
  },
});

export default CustomSegmentedControl;
