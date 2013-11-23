<!DOCTYPE html>
<!--
  Nicholas St.Pierre
	Student of UML CS course 91.461, GUI Programming

  nstpierr@cs.uml.edu
  10.22.2013

  Assignment number six

	This file was adapted from Jesse Heines' HTML template. Original header block follows:

	Copied File:  /~heines/91.461/91.461-2012-13f/461-lecs/code/j1.html
	Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
	Copyright (c) 2012 by Jesse M. Heines.  All rights reserved.  May be freely 
	copied or excerpted for educational purposes with credit to the author.
  
-->
<html>
  <head>
    <title>Assignment Six</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    
    <!-- css reset file. credit link contained within the file. -->
    <link rel="stylesheet" type="text/css" href="css/RESET.css"  />

    <!-- get jQuery -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    
    <!-- get jQuery validation plugin -->
    <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/jquery.validate.min.js"></script>
    
    <!-- from Google: NOTO SANS and Lusitana web fonts. -->
    <link href='http://fonts.googleapis.com/css?family=Noto+Sans|Lusitana:700|Titillium+Web:400,200' rel='stylesheet' type='text/css'>

    <!-- My common style sheet. -->
    <link rel="stylesheet" type="text/css" href="css/common.css" />
 
    <!-- CSS specific to this assignment. -->
    <link rel="stylesheet" type="text/css" href="css/a5.css" />
    
    <!-- professor heines' form utilities code. credit within. -->
    <script type="text/javascript" src="script/formUtilities.js"></script>
    
    <!-- Contains the main javascript for this assignment. -->
    <script type="text/javascript" src="script/a6.js"></script>
    
  </head>
  <body onload="makeTableIfPossible();"> 
    <!-- this onLoad function fires after the page is loaded. it creates the table if possible. -->
    
    
    <?php include 'navbar.inc.html'; // include the navbar from a file! ?>

    <!-- instructions box -->
    <div class="backgroundBox" >    
      <!-- casual introduction -->
      <h1>Assignment 6</h1>
      <h2>Using the jQuery Validation Plugin with Your Dynamic Table</h2>
      <br>
      <p>
        Welcome to my sixth assignment for GUI Programming 1! 
        This assignment is all about form validation. The following form will create a multiplication table from the input data.
        Enter numbers between one and forty two into the column and row boxes, and any number into the row and column start boxes.
        Then click the submit button to generate a multiplication table.
      </p>
    </div>

    <br>
    
    <!-- the form and output -->
    <div class="cleanBox"> <!-- a div for style -->
      <div id="input" class="backgroundBox" >
        <!-- error summary will appear here if needed. -->
        <p id='summary'></p>
        <!-- our input form! -->
        <form id="inputForm" action="a6.php" > <!-- onsubmit="return validateInput();"-->
          <!-- a simple table to align our input controls. please don't hate me. -->
          <table>
            <tr><td><label for="inputCols">columns</label></td><td><input type="number" name="inputCols" id="inputCols" class="input-positiveInt" /></td></tr>
            <tr><td><label for="inputRows">rows</label></td><td>   <input type="number" name="inputRows" id="inputRows" class="input-positiveInt" /></td></tr>
            <tr><td><label for="inputStartCols">column start</label></td><td><input type="number" name="inputStartCols" id="inputStartCols" class="input-Int" /></td></tr>
            <tr><td><label for="inputStartRows">row start</label></td><td><input type="number" name="inputStartRows" id="inputStartRows" class="input-Int" /></td></tr>
          </table>
          <br>
          <input type="submit" name="Submit!" value="go" />
        </form>
      </div>
      <!-- semi empty div for the result -->
      <div id="output" class="backgroundBox loose">
        <p>The table will appear here after you submit the form!</p>
      </div>
    </div>
    <!-- the css icon -->
    <p id="css-icon">
      <a href="http://jigsaw.w3.org/css-validator/check/referer">
          <img style="border:0;width:88px;height:31px"
              src="http://jigsaw.w3.org/css-validator/images/vcss"
              alt="Valid CSS!" />
      </a>
    </p>
  </body>
</html>
