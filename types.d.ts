/// <reference types="node" />

declare module 'object-resolve-path' {
  var resolvePath: any;
  export = resolvePath;
}

declare module 'geojson-validation' {
  var gjv: any;
  export = gjv;
}

declare module 'three-obj-mtl-loader' {
  var MTLLoader: any;
  var OBJLoader: any;
  export { MTLLoader, OBJLoader };
}

declare module 'ifc-convert' {
  var ifcConvert: any;
  export = ifcConvert;
}

declare module 'form-data' {
  var FormData: any;
  export = FormData;
}