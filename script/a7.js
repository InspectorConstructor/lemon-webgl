/**
 * Nicholas St.Pierre
 * Nov. 15 2013
 * Expression grapher using WebGL
 *
 * THIS CODE WAS STARTED FROM THE EXAMPLES AT
 * learningwebgl.com/lessons/lesson01/index.html (copied much webgl boilerplate)
 * and
 * http://jsbin.com/UriGaQo/81/edit (input handling and expr evaluating) ((thx curran))
 */



/*
 very-recommended inputs:
 >>> best <<< 8*cos(t*(theta+sin(t)))
 cos(t+2*x)*log(sin(x+t))
 sin(t+x)*log(sin(x+t)*x)
 (sin(t+x)*cos(sin(t+x*x))*x)/2
 */


// GLOBAL VARS //

var gl, // this will hold our webGL context. all of the gl functionality comes from this var.
        // NOTE THIS IS NOT THE CANVAS ELEMENT DOM OBJECT!
    math  = mathjs(), // loads the math lib namespace into this var 'math'.
    expr  = 'sin(x)*x', // holds the expression string. we initialize it to something pleasant.
    scope = { x: 0, t: 0 },
    tree  = math.parse(expr, scope), // tree holds our math expression. idk why curran named this 'tree'.
    time  = 0.0, // used to keep track of time so that we may have a time variable, 't' in our expressions.
    timeIncrement = 1.0, // how much the time variable changes each update
    curveVBO, axesVBO, // vertex buffer object
    shaderProgram, // var to hold our shader program. it's a webGL thing we just need. #moreBoilerplate
    mvMatrix = mat4.create(), // model-view matrix. NOTE: this must be run AFTER we parse the jl-matrix library
    pMatrix  = mat4.create(), // perspective matrix.
    pauseTimer = false,
    polar = false, 
    parametric = false,

        // Polar math parse stuff! r(theta)
    polarScope = {theta: 0, t: 0},
    polarExpr = '2.0',
    polarTree = math.parse(polarExpr, polarScope),
    
        // Parametric math set for X(w)
    paraXScope = {w: 0, t: 0},
    paraXExpr = 'w',
    paraXTree = math.parse(paraXExpr, paraXScope),
    
        // Parametric math set for Y(w)
    paraYScope = {w: 0, t: 0},
    paraYExpr = 'w',
    paraYTree = math.parse(paraYExpr, paraYScope);
    
///////////////////////////////////////////////////////

/**
 Function to initialize the gl var declared above.
 Accepts a reference to a Canvas DOM element.
 Returns nothing.
 */
function initGL(canvas) {
  try {
    gl = canvas.getContext("webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialize WebGL, sorry :-(");
  }
}

/**
 'Gets' a shader by getting a script element from the DOM... cool.
 Copied from the lesson 01 page.
 Accepts a gl context and a script DOM element ID.
 */
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

/**
 webgl boilerplate.
 loads our shaders.
 */
function initShaders() {

  var fragmentShader = getShader(gl, "shader-fs"),
        vertexShader = getShader(gl, "shader-vs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


/**
 Takes our matrices and sends them to the shaders.
 Anytime we need to update the matrices in the shaders,
 we gotta call this.

 It appears that OpenGL keeps its own set of state variables for performance reasons.
 (one might be that we need to actually update the GPU registers, and we obviously need a special call for this.)

 */
function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform,  false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

/**
 samples the math function.
 returns an array of points.
 @TODO make this more easily tweakable
 */
function sampleCurve(samplesRequested)
{ 
  var i, x, y, r, theta, radians,
      scale = 0.1, ret = [], startVal = -170.0,
      edgeVal = 5.0, sampleRate = 0.5, polarSampleRate=0.5;

  // we leep track of how many vertices are inside this buffer.
  ret.len = 0;
  
  // sample our math function and create an array of points
  if( polar )
  {
    for(theta = 0.0 ; theta <= 360.0 * 5.0 ; theta+=polarSampleRate)
    {  

      radians=theta*math.PI/180.0;
      // evaluate the polar expression
      r = evaluatePOLARMathExpr(radians);

      // obtain an x and y coordinate for the polar point.
      x = r * Math.cos(radians);
      y = r * Math.sin(radians);

      // add the sample to the result array
      ret.push(x);
      ret.push(y);
      ret.push(0.0);

      //console.log("pushing ("+x+","+y+")");
      ret.len++;

    }
  }
  else if(parametric) // parametric mode
  {
    for (i = (0.0 - samplesRequested); i < samplesRequested; i += sampleRate)
    {
    
    // sample BOTH the equations
      x = evaluateParaXMathExpr(i);
      y = evaluateParaYMathExpr(i);
    
    // add the sample to the result array
      ret.push(x);
      ret.push(y);
      ret.push(0.0);

      //console.log("pushing ("+x+","+y+")");
      ret.len++;
    
    
    }
  }
  else // cartesian
  {
    for (i = (0.0 - samplesRequested); i < samplesRequested; i += sampleRate)
    {
      x = (i + startVal) * scale;
      y = evaluateMathExpr(x);

      // add the sample to the result array
      ret.push(x);
      ret.push(y);
      ret.push(0.0);

      //console.log("pushing ("+x+","+y+")");
      ret.len++;
    }
  }

  return ret;

}


/**
  initializes the axesVBO with axes and tick marks along the axes.
  it's cool.
 */
function initAxes()
{

  var axesLen = 16.0;

  var segmentLen = axesLen / 2.0;
  var points = [];

  axesVBO.itemSize = 3; // if we start using vec4's instead of vec3's, make this a 4.

  // X axis
  points.push(segmentLen);
  points.push(0.0);
  points.push(0.0);
  points.push(-segmentLen);
  points.push(0.0);
  points.push(0.0);

  // Y axis
  points.push(0.0);
  points.push(segmentLen);
  points.push(0.0);
  points.push(0.0);
  points.push(-segmentLen);
  points.push(0.0);

  // Z axis... if we go 3d.
  /*
   points.push(0.0);   points.push(0.0);   points.push( segmentLen);
   points.push(0.0);   points.push(0.0);   points.push(-segmentLen);
   */

  axesVBO.numItems = 4; // make this 6 if we uncomment the z-axis

  // make the tick marks. we do both axes in this loop
  
  var tickHalf = 0.08;
  
  for( var i = (1.0-segmentLen) ; i < segmentLen ; i++ )
  {
    
    // X AXIS
      points.push( tickHalf);  points.push(i);  points.push(0.0);
      points.push(-tickHalf);  points.push(i);  points.push(0.0);

    // Y AXIS
      points.push(i);  points.push( tickHalf);  points.push(0.0);
      points.push(i);  points.push(-tickHalf);  points.push(0.0);


    // Z AXIS??? not in this version...

    axesVBO.numItems += 4;
    
  }
  
  
  // give WGL our new array of points
  gl.bindBuffer(gl.ARRAY_BUFFER, axesVBO); // bind the buffer (state is weird but important
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW); //

  // set some properties WE invented. they are used later to make everything cooler.

}


/**
 This function re-populates the curveVBO gl buffer.
 It re-samples the math expression and updates the VBO.
 */
function createCurveBuffer()
{
  var samplesAskedFor = 340; // work in progress don't ask
  var vertices = sampleCurve(samplesAskedFor); // same

  // give WGL our new array of points
  gl.bindBuffer(gl.ARRAY_BUFFER, curveVBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // set some properties WE invented. they are used later to make everything cooler.
  curveVBO.itemSize = 3; // if we start using vec4's instead of vec3's, make this a 4.
  curveVBO.numItems = vertices.len;

}


function zoom(direction)
{
  distAway += (direction === "in") ? 0.5 : -0.5 ;
}

/* function drawSceneOLD() {// old reference code. here as a reference.
 gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
 gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
 mat4.identity(mvMatrix);
 mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
 gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
 gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
 triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
 setMatrixUniforms();
 gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
 mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
 gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
 gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
 squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
 setMatrixUniforms();
 gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
 }*/

//8*cos(t*(theta+sin(t))) slowly please

function drawScene()
{
  gl.lineWidth(2.2);
  //gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  mat4.identity(mvMatrix);
  //mat4.scale(0.5, mvMatrix);
  mat4.translate(mvMatrix, [0.0, 0.0, distAway]);

  setMatrixUniforms();

  gl.bindBuffer(gl.ARRAY_BUFFER, curveVBO);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
          curveVBO.itemSize, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINE_STRIP, 0, curveVBO.numItems);

  drawAxes(); 
}

var distAway = -20.0; 

/**
 * Gets the mouse CANVAS position.
 * credit to the following source
 * http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
 * @param {canvas DOM element} canvas
 * @param {event} evt
 * @returns {getMousePos.Anonym$0}
 */
function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

/**
 * This is our main(), persay.
 * Init everything and enter the animation loop forever.
 * @returns {undefined}
 */
function webGLStart() {

  var canvas = document.getElementById("the-screen");

  // prep the text field.
  initTextFields();

  // setup the gl var.
  initGL(canvas);

  // get the shaders.
  initShaders();

  // get the axes ready
  axesVBO = gl.createBuffer();
  initAxes();

  gl.clearColor(0.0, 0.05, 0.05, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  
  curveVBO = gl.createBuffer();

  canvas.addEventListener('mousemove', function(evt) {
          var mousePos = getMousePos(canvas, evt);
          console.log("mousePos is " + mousePos.x + ", " + mousePos.y);
          
        }, false);

  (function animLoop() {
    
      requestAnimationFrame(animLoop);
      if(! pauseTimer) {
        render();
        time += timeIncrement;
    }
  }());
}

function toggleTimerPause()
{
  pauseTimer = ! pauseTimer;
  $("#pause").html(pauseTimer ? "Unpause" : "Pause" );
}

function drawAxes()
{

  gl.lineWidth(1.0);

  gl.bindBuffer(gl.ARRAY_BUFFER, axesVBO);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                         axesVBO.itemSize, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.LINES, 0, axesVBO.numItems);

}


var tval=document.getElementById("tval");

function render()
{ // console.debug("rendering()");
  tval.innerHTML=Math.round(time*10)/10;
  createCurveBuffer(); // update the curve buffer
  drawScene();         // render the curve
}

//////////////////////////////////////////////////


function evaluateMathExpr(mathX) {
  //console.log("in evaluateMathExpr()");
  scope.x = mathX;
  scope.t = time/100.0; // we slow down the timer here
  return tree.eval();
}

function evaluatePOLARMathExpr(in_theta) {
  //console.log("in evaluateMathExpr()");
  polarScope.theta = in_theta;
  polarScope.t     = time/100.0; // here too
  return polarTree.eval();
}

function evaluateParaXMathExpr(win) {
  //console.log("in evaluateMathExpr()");
  paraXScope.w = win;
  paraXScope.t = time/100.0; // here too
  return paraXTree.eval();
}

function evaluateParaYMathExpr(win) {
  //console.log("in evaluateMathExpr()");
  paraYScope.w = win;
  paraYScope.t = time/100.0; // here too
  return paraYTree.eval();
}



function resetTimer()
{
  time = 0;
  render();
}


/**
 * function that inits the text fields. 
 * it's a collection of other init functions
 * called here for clarity.
 * @returns {undefined}
 */
function initTextFields()
{
  initCartesianField();
  initPOLARTextField();
  initParaXTextField();
  initParaYTextField();
  initTimeBox();
}


function initCartesianField() {

  var input = $('#inputField');

  // Listen for changes using jQuery.
  // Update our math objects on keychange.
  input.keyup(function(event) {
    expr = input.val();
    try {
      tree = math.parse(expr, scope);
    }
    catch (e)
    {
      console.log("Couldn't parse input \"" +
              expr +
              "\" : " +
              e.message); // gracefully handle bad input.
    }
    render(); // uncomment if we remove the animLoop()
  });
}


function initPOLARTextField() {

  var inputTheta = $('#inputTheta');

  // Listen for changes using jQuery.
  // Update our math objects on keychange.
  inputTheta.keyup(function(event) {
    polarExpr = inputTheta.val();
    
    polarExpr = polarExpr.replace("\n",'');
    try {
      polarTree = math.parse(polarExpr, polarScope);
    }
    catch (e)
    {
      console.log("Couldn't parse polar input \"" +
              expr +
              "\" : " +
              e.message); // gracefully handle bad input.
    }
    render(); // uncomment if we remove the animLoop()
  });
}


function initParaXTextField() {

  var input = $('#inputParaX');

  // Listen for changes using jQuery.
  // Update our math objects on keychange.
  input.keyup(function(event) {
    paraXExpr = input.val();
    
    paraXExpr = paraXExpr.replace("\n",''); // handle newlines in the input
    try {
      paraXTree = math.parse(paraXExpr, paraXScope);
    }
    catch (e)
    {
      console.log("Couldn't parse parametric X input \"" +
              expr +
              "\" : " +
              e.message); // gracefully handle bad input.
    }
    render(); // uncomment if we remove the animLoop()
  });
}


function initParaYTextField() {

  var input = $('#inputParaY');

  // Listen for changes using jQuery.
  // Update our math objects on keychange.
  input.keyup(function(event) {
    paraYExpr = input.val();
    
    paraYExpr = paraYExpr.replace("\n",'');
    try {
      paraYTree = math.parse(paraYExpr, paraYScope);
    }
    catch (e)
    {
      console.log("Couldn't parse parametric Y input \"" +
              expr +
              "\" : " +
              e.message); // gracefully handle bad input.
    }
    render(); // uncomment if we remove the animLoop()
  });
}


function initTimeBox()
{

  var input = $('#timeIncr');

  // Listen for changes using jQuery.
  // Update our math objects on keychange.
  input.keyup(function(event) {
    var val = parseFloat(input.val());
    if(isFinite(val))
    {
      timeIncrement = val;
    }
    else 
    { // warn bad input
      console.debug("timebox value is not valid.");
    }
  });
  parseFloat();

}



