import * as React from "react";
import { LayoutChangeEvent, View, ViewProperties } from "react-native";

let WrapperClass: any = View;

export function SetWrapperClass(cClass: any): void {
  WrapperClass = cClass;
}

export function GetWrapperClass(): any {
  return WrapperClass;
}
