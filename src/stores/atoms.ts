import { atom } from "jotai";
import { Model3D } from "../types";
import * as THREE from "three";

export const modelsAtom = atom<Model3D[]>([]);
export const selectedModelAtom = atom<Model3D | null>(null);
export const searchQueryAtom = atom("");
export const selectedCategoryAtom = atom("All");
export const showModelSelectorAtom = atom(false);

export interface SceneObject {
  id: string;
  name: string;
  modelUrl: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

export const sceneObjectsAtom = atom<SceneObject[]>([]);
export const selectedObjectAtom = atom<string | null>(null);
