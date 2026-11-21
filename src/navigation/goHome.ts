import { StackActions } from '@react-navigation/native';

/**
 * Header back buttons always return to the Home tab.
 *
 * `MainApp` is the root route that hosts the bottom tabs, so this works from
 * nested stacks (Academics) as well as from root-stack screens such as
 * Announcements. Screens pushed on the current stack are cleared first, so the
 * Academics tab opens at its menu instead of a stale deep screen.
 */
export function goHome(navigation: any) {
  navigation.dispatch(StackActions.popToTop());
  navigation.navigate('MainApp', { screen: 'Home' });
}
