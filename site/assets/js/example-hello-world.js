var canvas = document.getElementById('mainCanvas');

var graphicsDevice = new Zia.GraphicsDevice(canvas);

var program = new Zia.BasicProgram(graphicsDevice, {
  lightingEnabled: true
});
program.diffuseColor = new Zia.Vector3(0.5, 1, 0.5);
program.enableDefaultLighting();

var cubePrimitive = Zia.GeometricPrimitive.createCube();

var vertexData = Zia.GeometricPrimitive.mergeVertexData(
  cubePrimitive.positions, cubePrimitive.normals,
  cubePrimitive.textureCoordinates);
var vertices = new Float32Array(vertexData);

var vertexBuffer = new Zia.VertexBuffer(graphicsDevice,
  new Zia.VertexDeclaration(
  [
    new Zia.VertexElement("aVertexPosition", 3, 0),
    new Zia.VertexElement("aVertexNormal", 3, 3 * 4),
    new Zia.VertexElement("aTextureCoord", 2, 6 * 4)
  ]),
  vertices);

var indexBuffer = new Zia.IndexBuffer(graphicsDevice,
  new Uint16Array(cubePrimitive.indices));

var projectionMatrix = Zia.Matrix4.createPerspectiveFieldOfView(
  Zia.MathUtil.PI_OVER_FOUR, graphicsDevice.viewport.aspectRatio, 0.1, 100);
var viewMatrix = Zia.Matrix4.createLookAt(
  new Zia.Vector3(1.5, 1, -2),
  new Zia.Vector3(0, 0, 0),
  new Zia.Vector3(0, 1, 0));
var modelMatrix = Zia.Matrix4.createIdentity();

graphicsDevice.setIndexBuffer(indexBuffer);
graphicsDevice.setVertexBuffer(vertexBuffer);

graphicsDevice.clear(
  Zia.ClearOptions.ColorBuffer | Zia.ClearOptions.DepthBuffer,
  new Zia.Color4(0, 0, 0, 1), 1);

program.viewMatrix = viewMatrix;
program.projectionMatrix = projectionMatrix;
program.modelMatrix = modelMatrix;
program.apply();

graphicsDevice.drawIndexedPrimitives(
  Zia.PrimitiveType.TriangleList,
  0, 36);
