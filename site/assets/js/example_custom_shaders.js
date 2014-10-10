document.addEventListener('DOMContentLoaded', function () {

  var fragmentShaderCode = [
    "varying highp vec2 vTextureCoord;",

    "uniform sampler2D uSampler;",
  
    "void main(void) {",
    "  gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));",
    "}"
  ].join('\n');

  var vertexShaderCode = [
    "attribute vec3 aVertexPosition;",
    "attribute vec2 aTextureCoord;",

    "uniform mat4 uMVMatrix;",
    "uniform mat4 uPMatrix;",
    
    "varying highp vec2 vTextureCoord;",

    "void main(void) {",
    "  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
    "  vTextureCoord = aTextureCoord;",
    "}"
  ].join('\n');
  
  var canvas = document.getElementById('mainCanvas');
  
  var graphicsDevice = new Zia.GraphicsDevice(canvas);

  var vertexShader = new Zia.VertexShader(graphicsDevice, vertexShaderCode);
  var fragmentShader = new Zia.FragmentShader(graphicsDevice, fragmentShaderCode);
  var program = new Zia.BasicProgram(graphicsDevice, {
    textureEnabled: true
  });

  var texture = Zia.Texture.createFromImagePath(graphicsDevice, '../assets/textures/UV_Grid_Sm.jpg');

  var vertexBuffer = new Zia.VertexBuffer(graphicsDevice,
    Zia.BoxPrimitive.vertexDeclaration);
  vertexBuffer.setData(Zia.BoxPrimitive.vertices);

  var indexBuffer = new Zia.IndexBuffer(graphicsDevice);
  indexBuffer.setData(Zia.BoxPrimitive.indices);

  var projectionMatrix = new Zia.Matrix4().makePerspective(45,
    graphicsDevice.viewport.aspectRatio, 0.1, 100);
  var viewMatrix = new Zia.Matrix4().makeTranslation(0, 0, -6);
  var modelMatrix = new Zia.Matrix4().identity();

  var lastCubeUpdateTime, cubeRotation = 0;
  var rotationAxis = new Zia.Vector3(1, 0, 1).normalize();
  var modelViewMatrix = new Zia.Matrix4();

  graphicsDevice.setIndexBuffer(indexBuffer);
  graphicsDevice.setVertexBuffers([vertexBuffer]);
  graphicsDevice.setProgram(program);

  function drawScene() {
    if (graphicsDevice.resize()) {
      projectionMatrix.makePerspective(45,
        graphicsDevice.viewport.aspectRatio,
        0.1, 100);
    }
    
    graphicsDevice.clear(
      Zia.ClearOptions.ColorBuffer | Zia.ClearOptions.DepthBuffer,
      new Zia.Color4(0, 0, 0, 1), 1);

    modelMatrix.makeRotationAxis(rotationAxis, cubeRotation);
    modelViewMatrix.multiplyMatrices(viewMatrix, modelMatrix);

    program.begin();

    program.texture = texture;
    program.model = modelMatrix;
    program.view = viewMatrix;
    program.projection = projectionMatrix;

    graphicsDevice.drawIndexedPrimitives(
      Zia.PrimitiveType.TriangleList,
      0, 36);

    program.end();

    var currentTime = (new Date).getTime();
    if (lastCubeUpdateTime) {
      var delta = currentTime - lastCubeUpdateTime;
      
      cubeRotation += (30 * delta) / 100000.0;
    }
    
    lastCubeUpdateTime = currentTime;

    requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);

}, false);