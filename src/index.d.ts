import { EventData } from 'tns-core-modules/data/observable';
import { AddChildFromBuilder, View } from 'tns-core-modules/ui/core/view';

export declare interface OnTabPressedEventData extends EventData {
  index: number;
}

export declare interface OnTabReselectedEventData extends EventData {
  index: number;
}

export declare interface OnTabSelectedEventData extends EventData {
  oldIndex: number;
  newIndex: number;
}

export type TitleVisibility = 'always' | 'selected' | 'never';

export declare abstract class BottomNavigationBase extends View implements AddChildFromBuilder {

  public tabs: BottomNavigationTabBase[];

  public selectedTabIndex: number;

  public titleVisibility: TitleVisibility;

  public activeColor: string;

  public inactiveColor: string;

  public backgroundColor: string;

  @Deprecated
  public keyLineColor: string;

  public selectTab(index: number): void;

  _addChildFromBuilder(name: string, value: any): void;

  protected abstract selectTabNative(index: number): void;
}

export declare class BottomNavigationTabBase {

  public title: string;

  public icon: string;

  public selectable: boolean;

  parent: WeakRef<BottomNavigationBase>;

  constructor(title: string, icon: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>);
}

export declare class BottomNavigation extends BottomNavigationBase {

  readonly ios: any;

  private _delegate;

  constructor();

  public createTabs(tabs: BottomNavigationTab[]): void;

  protected selectTabNative(index: number): void;
}

export declare class BottomNavigationTab extends BottomNavigationTabBase {
  constructor(title: string, icon: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>);
}
