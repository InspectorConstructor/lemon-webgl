<!DOCTYPE html>
<!--
  Nicholas St.Pierre
	Student of UML CS course 91.461, GUI Programming

  nstpierr@cs.uml.edu
  10.22.2013

	This file was adapted from Jesse Heines' HTML template. Original header block follows:

	Copied File:  /~heines/91.461/91.461-2012-13f/461-lecs/code/j1.html
	Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
	Copyright (c) 2012 by Jesse M. Heines.  All rights reserved.  May be freely 
	copied or excerpted for educational purposes with credit to the author.
  
-->
<html>
  <head>
    <title>Assignment Five</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    
    <!-- css reset file. credit link contained within the file. -->
    <link rel="stylesheet" type="text/css" href="css/RESET.css"  />

    <!-- from Google: NOTO SANS and Lusitana web fonts. -->
    <link href='http://fonts.googleapis.com/css?family=Noto+Sans|Lusitana:700|Titillium+Web:400,200' rel='stylesheet' type='text/css'>

    <!-- My common style sheet. -->
    <link rel="stylesheet" type="text/css" href="css/common.css" />
 
    <!-- CSS specific to this assignment. -->
    <link rel="stylesheet" type="text/css" href="css/a5.css" />
    
    <!-- professor heines' form utilities code. credit within. -->
    <script type="text/javascript" src="script/formUtilities.js"></script>
    
    <!-- Contains the main javascript for this assignment. -->
    <script type="text/javascript" src="script/a5.js"></script>
    
  </head>
  <body onload="makeTableIfPossible();"> 
    <!-- this onLoad function fires after the page is loaded. it creates the table if possible. -->
    
    
    <?php include 'navbar.inc.html'; // include the navbar from a file! ?>
    
    <div class="backgroundBox" >    
      <!-- casual introduction -->
      <h1>Assignment 5</h1>
      <h2>Creating a Dynamic Table</h2>
      <br>
      <p>
        Welcome to my fifth assignment for GUI Programming 1! 
        This assignment is all about form submission: 
        enter some numbers into the boxes below and click the smiley-face submit button to generate a multiplication table.
      </p>
    </div>
    
    <br>
    
    <div class="cleanBox"> <!-- a div for style -->
      <div id="input" class="backgroundBox horiz-p" > 
        
        <!-- our input form! -->
        <form action="a5.php" onsubmit="return validateInput();">
          <p class="unit">columns <input type="number" name="inputCols" id="inputCols" /></p>
          <p class="unit">rows <input    type="number" name="inputRows" id="inputRows" /></p>
          <p class="unit">column start <input type="number" name="inputStartCols" id="inputStartCols" /></p>
          <p class="unit">row start <input    type="number" name="inputStartRows" id="inputStartRows" /></p>
          <!--button onclick="makeTableFromForm();"><img src="http://www.ucs.louisiana.edu/~kxk4695/smile.gif"></button-->
          <input type="submit" name="Submit!" value="go" />
        </form>
      </div>
      <!-- semi empty div for the result -->
      <div id="output" class="backgroundBox loose">
        <p>The table will appear here after you submit the form!</p>
      </div>
    </div>
    <p id="css-icon">
      <a href="http://jigsaw.w3.org/css-validator/check/referer">
          <img style="border:0;width:88px;height:31px"
              src="http://jigsaw.w3.org/css-validator/images/vcss"
              alt="Valid CSS!" />
      </a>
    </p>
  </body>
</html>
