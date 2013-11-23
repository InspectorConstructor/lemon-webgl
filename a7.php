<!DOCTYPE html>
<!--

  Nicholas St.Pierre
  11.8.2013

  a7.php

  wow
  Graphing Calculator

-->
<!DOCTYPE html>
<html>
  <head>
    <meta charset=utf-8 />
    <title>WebGL Grapher</title>

    <!-- css reset file. credit link contained within the file. -->
    <link rel="stylesheet" type="text/css" href="css/RESET.css"  />

    <!-- My common style sheet. -->
    <link rel="stylesheet" type="text/css" href="css/common.css" />


    <link rel="stylesheet" type="text/css" href="css/a7.css" />

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/mathjs/0.15.0/math.min.js"></script>
    <script src="script/gl-Matrix-0.9.5-min.js"></script>

    <!-- this is a "fragment shader." It is mainly responsible for the coloring of pixels. -->
    <script id="shader-fs" type="x-shader/x-fragment">
      precision mediump float;
      varying vec4 pos;

      void main(void) {
      gl_FragColor = vec4(1.0,0.0,0.0,1.0); // R, G, B, A

      /* gl_FragColor = vec4(pos.x/10.0, //red
      (-pos.y/2.0), //green
      (1.0-pos.x/2.0), //blue
      1.0); // alpha */
      }
    </script>

    <!--
      this is a vertex shader. it applies transformations to points in the world.
      it applies transformations by performing matrix multiplications....
      it runs for every single point.

      Although not complex, the explanation for why this shader is setup the way it is is rather long,
      and I'm not in the mood to explain this yet, so this explanation will be in another post. (maybe)
    -->
    <script id="shader-vs" type="x-shader/x-vertex">
      attribute vec3 aVertexPosition; // our incoming point. (this value changes per point)

      uniform mat4 uMVMatrix; // our model view matrix (same for all points in one rendering.)
      uniform mat4 uPMatrix;  // our perspective matrix (same value for all points in a render.)
      varying vec4 pos;       // sends the world cooridinate to the fragment shader. (varies per point and sent to the f-shader)

      void main(void) { // EW GROSS C-LIKE wait jk it's actually rad.
      gl_PointSize=2.0; // sets the point size if we render points. otherwise has no effect.
      pos = uMVMatrix * vec4(aVertexPosition, 1.0); // calculate model cooridinates, send to f-shader
      gl_Position = uPMatrix * pos ; // apply our perspective and send that point.
      }
    </script>
    <script src="script/a7.js" defer></script>
  </head>
  <body onload="webGLStart();">
    <?php include 'navbar.inc.html'; // include the navbar from a file! ?>

    <div class="" style="width: 88%;">
      <!-- instructions box -->
      <div class="backgroundBox" >    
        <!-- casual introduction -->
        <h1>Assignment 7</h1>
        <h2>Programming a graphing calculator using WebGL</h2>
        <br>
        <p>
          This is my assignment seven page. It contains a canvas and a set of input elements.
        </p>
        <p>
          The canvas is driven using WebGL - the standard for 3D graphics on the web.
          However, using a projection type called "orthographic projection", we can use WebGL as a 2D surface.
          I originally intended to make a 3D surface-graphing calculator for this assignment, but was unable to complete debugging in time.
        </p>
        <p>
          To use this page, select a mode by clicking any of the buttons below. 
          Enter a mathematical expression in the corresponding textbox(es), and the graph will draw automatically.
        </p>
      </div>

      <br>
      <div class="backgroundBox">
        <div class="cleanBox inline-block">
          <ul>
            <li>
              <div class="lowerBorder">
                <h3>Cartesian Controls</h3>
                <p>
                  Enter a function in terms of x and t.
                </p>
                <label for='inputField'>Cartesian equation</label>
                <input id="inputField" placeholder="ie: sin(x)*x">
                <br>
                <button id="cartON" onclick="polar = false;
                                             parametric = false;
                                             render();">Select Cartesian Mode</button>
              </div>
            </li>
            <br>
            <li>
              <div class="lowerBorder">
                <h3>Polar Controls</h3>
                <p>
                  Enter a function in terms of theta and t.
                </p>           
                <label for='inputTheta'>Polar Equation</label>
                <textarea id="inputTheta" placeholder="ie: sin(t)*theta"></textarea>
                <br>
                <button id="polarON" onclick="polar = true;
                                              parametric = false;
                                              render();">Select Polar Mode</button>
              </div>
            </li>
            <br>
            <li>
              <div class="lowerBorder">
                <h3>Parametric Controls</h3>
                <p>
                  Enter two functions in terms of w and t.
                </p>
                <label for='inputParaX'>X Equation</label>
                <textarea id="inputParaX" placeholder="ie: sin(t)*w"></textarea>
                <br>
                <label for='inputParaY'>Y Equation</label>
                <textarea id="inputParaY" placeholder="ie: cos(t)*w"></textarea>
                <br>
                <button id="paraON"  onclick="polar = false;
                                              parametric = true;
                                              render();">Select Parametric Mode</button>
              </div>
            </li>
            <br>
            <label for='timeIncr'>Time Speed</label>
            <input id="timeIncr"   placeholder="time speed"  value="1.0">
            <p>t = <span id="tval">0</span></p><button onclick="resetTimer();">Reset time</button>
            <button id="pause" onclick="toggleTimerPause();">Pause</button>
            <button onclick="zoom('in');">Zoom In</button>
            <button onclick="zoom('out');">Zoom Out</button>
          </ul>
        </div>
        <div class="inline-block bocks">
          <canvas   id="the-screen"
                    style="border: yellow thin solid;"
                    width="600"
                    height="600">SORRY, THE CANVAS WON'T WORK ON YOUR BROWSER... :'(</canvas>
        </div>
      </div>
    </div>
  </body>
</html>
