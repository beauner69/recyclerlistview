import * as React from "react";
import { LayoutChangeEvent, View, ViewProperties } from "react-native";
import { Dimension } from "../../../core/dependencies/LayoutProvider";
import BaseViewRenderer, {
  ViewRendererProps,
} from "../../../core/viewrenderer/BaseViewRenderer";

import { GetWrapperClass } from "../../../utils/WrapperClass"; //BNC
/***
 * View renderer is responsible for creating a container of size provided by LayoutProvider and render content inside it.
 * Also enforces a logic to prevent re renders. RecyclerListView keeps moving these ViewRendereres around using transforms to enable recycling.
 * View renderer will only update if its position, dimensions or given data changes. Make sure to have a relevant shouldComponentUpdate as well.
 * This is second of the two things recycler works on. Implemented both for web and react native.
 */
export default class ViewRenderer extends BaseViewRenderer<any> {
  private _dim: Dimension = { width: 0, height: 0 };
  private _viewRef: React.Component<
    ViewProperties,
    React.ComponentState
  > | null = null;
  public render(): JSX.Element {
    const ViewOverflow: any = GetWrapperClass(); //BNC
    return this.props.forceNonDeterministicRendering ? (
      <ViewOverflow //BNC
        ref={this._setRef}
        onLayout={this._onLayout}
        style={{
          overflow: "visible", //BNC
          flexDirection: this.props.isHorizontal ? "column" : "row",
          left: this.props.x,
          position: "absolute",
          top: this.props.y,
          zIndex: this.props.data.focus ? 10000 : undefined, //BNC
          ...this.props.styleOverrides,
          ...this.animatorStyleOverrides,
        }}
      >
        {this.renderChild()}
      </ViewOverflow> //BNC
    ) : (
      <ViewOverflow //BNC
        ref={this._setRef}
        style={{
          overflow: "visible", //BNC
          left: this.props.x,
          position: "absolute",
          top: this.props.y,
          height: this.props.height,
          width: this.props.width,
          zIndex: this.props.data.focus ? 10000 : undefined, // BNC
          ...this.props.styleOverrides,
          ...this.animatorStyleOverrides,
        }}
      >
        {this.renderChild()}
      </ViewOverflow> //BNC
    );
  }

  protected getRef(): object | null {
    return this._viewRef;
  }

  private _setRef = (
    view: React.Component<ViewProperties, React.ComponentState> | null
  ): void => {
    this._viewRef = view;
  };

  private _onLayout = (event: LayoutChangeEvent): void => {
    //Preventing layout thrashing in super fast scrolls where RN messes up onLayout event
    const xDiff = Math.abs(this.props.x - event.nativeEvent.layout.x);
    const yDiff = Math.abs(this.props.y - event.nativeEvent.layout.y);
    if (
      xDiff < 1 &&
      yDiff < 1 &&
      (this.props.height !== event.nativeEvent.layout.height ||
        this.props.width !== event.nativeEvent.layout.width)
    ) {
      this._dim.height = event.nativeEvent.layout.height;
      this._dim.width = event.nativeEvent.layout.width;
      if (this.props.onSizeChanged) {
        this.props.onSizeChanged(this._dim, this.props.index);
      }
    }
  };
}
