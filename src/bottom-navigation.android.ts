import {
  activeColorCssProperty,
  activeColorProperty,
  backgroundColorCssProperty,
  backgroundColorProperty,
  BottomNavigationBase,
  BottomNavigationTabBase,
  inactiveColorCssProperty,
  inactiveColorProperty,
  tabsProperty,
  keyLineColorProperty,
  keyLineColorCssProperty,
  TitleVisibility,
  TitleVisibilityOptions,
  titleVisibilityProperty,
} from './bottom-navigation.common';
import { Color } from 'tns-core-modules/color';
import { fromResource } from 'tns-core-modules/image-source';

declare const com, android: any;

const BitmapDrawable = android.graphics.drawable.BitmapDrawable;
const AHBottomNavigation = com.aurelhubert.ahbottomnavigation.AHBottomNavigation;
const AHBottomNavigationItem = com.aurelhubert.ahbottomnavigation.AHBottomNavigationItem;

export class BottomNavigation extends BottomNavigationBase {
  protected titleVisibilityOptions: TitleVisibilityOptions = {
    always: AHBottomNavigation.TitleState.ALWAYS_SHOW,
    never: AHBottomNavigation.TitleState.ALWAYS_HIDE,
    selected: AHBottomNavigation.TitleState.SHOW_WHEN_ACTIVE,
  };

  get android(): any {
    return this.nativeView;
  }

  createNativeView(): Object {
    const owner = new WeakRef(this);
    this.nativeView = new AHBottomNavigation(this._context);
    this.nativeView.setOnTabSelectedListener(new AHBottomNavigation.OnTabSelectedListener(
      {
        get owner(): BottomNavigation {
          return owner.get();
        },
        onTabSelected: function (position: number, wasSelected: boolean): boolean {
          const bottomNavigationTab = this.owner.tabs[position];
          if (!wasSelected && bottomNavigationTab.selectable) {
            this.owner.onTabSelected(position);
          }
          if (wasSelected && bottomNavigationTab.selectable) {
            this.owner.onTabReselected(position);
          }
          // I'm using a different if to avoid to fire the event on bottomNavigation initialization
          if (!wasSelected && !bottomNavigationTab.selectable) {
            this.owner.onTabPressed(position);
          }
          return bottomNavigationTab.selectable;
        }
      }
    ));

    return this.nativeView;
  }


  initNativeView(): void {
    this.nativeView.setTitleState(AHBottomNavigation.TitleState.ALWAYS_SHOW);
    this.nativeView.setAccentColor(new Color(this.activeColor).android);
    this.nativeView.setInactiveColor(new Color(this.inactiveColor).android);
    this.nativeView.setColored(false);
    this.nativeView.setDefaultBackgroundColor(new Color(this.backgroundColor).android);
  }

  createTabs(tabs: BottomNavigationTab[]) {
    if (!this.tabs) { this.tabs = tabs; }
    for (let tab of tabs) {
      let icon = new BitmapDrawable(fromResource(tab.icon).android);
      let item = new AHBottomNavigationItem(tab.title, icon, new Color('white').android);
      this.nativeView.addItem(item);
    }
    // Commented to avoid listener call after initialization.
    // this.nativeView.setCurrentItem(this.selectedTabIndex);
  }

  [tabsProperty.getDefault](): BottomNavigationTab[] {
    return null;
  }

  [tabsProperty.setNative](value: BottomNavigationTab[]) {
    this.createTabs(value);
  }

  [titleVisibilityProperty.getDefault](): TitleVisibility {
    return 'selected';
  }

  [titleVisibilityProperty.setNative](value: TitleVisibility) {
    this.nativeView.setTitleState(this.titleVisibilityOptions[value]);
  }

  [activeColorProperty.setNative](activeColor: string) {
    this.nativeView.setAccentColor(new Color(activeColor).android);
  }

  [activeColorCssProperty.setNative](activeColor: Color) {
    this.nativeView.setAccentColor(activeColor.android);
  }

  [inactiveColorProperty.setNative](inactiveColor: string) {
    this.nativeView.setInactiveColor(new Color(inactiveColor).android);
  }

  [inactiveColorCssProperty.setNative](inactiveColor: Color) {
    this.nativeView.setInactiveColor(inactiveColor.android);
  }

  [backgroundColorProperty.setNative](backgroundColor: string) {
    this.nativeView.setDefaultBackgroundColor(new Color(backgroundColor).android);
  }

  [backgroundColorCssProperty.setNative](backgroundColor: Color) {
    this.nativeView.setDefaultBackgroundColor(backgroundColor.android);
  }

  [keyLineColorProperty.setNative](keyLineColor: string) {
    // This inly works with ios
  }

  [keyLineColorCssProperty.setNative](keyLineColor: Color) {
    // This inly works with ios
  }

  protected selectTabNative(index: number): void {
    this.nativeView.setCurrentItem(index);
  }

}

export class BottomNavigationTab extends BottomNavigationTabBase {
  constructor(title: string, icon: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>) {
    super(title, icon, selectable, parent);
  }
}
