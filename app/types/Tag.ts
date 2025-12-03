export interface TagData {
  tag: string;
  count: number;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface TagWithPosition extends TagData {
  position: Position3D;
}
