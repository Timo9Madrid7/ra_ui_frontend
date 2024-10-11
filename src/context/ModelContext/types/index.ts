import {BufferGeometry, Mesh, MeshStandardMaterial} from "three";

export type ModelFile = {
  fileData: ArrayBufferLike;
  name?: string;
};

export type ModelLayerGroup = {
  id: string;
  name: string;
  children: Array<Mesh<BufferGeometry, MeshStandardMaterial>>;
};

export type LayerUserAttribute = {
  id: string;
  name: string;
  fullPath: string;
  expanded:boolean;
  igesLevel: number;
  isValid: boolean;
  linetypeIndex: number;
  locked: boolean;
  parentLayerId: string;
  plotColor: object;
  plotWeight: number;
  renderMaterialIndex: number;
  userStringCount: number;
  visible: true;
}