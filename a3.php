<!DOCTYPE html>
<!--
	author:   Nicholas St.Pierre
	email:    nstpierr@cs.uml.edu
	
	Student of UML CS course 91.461, GUI Programming

	created:  9/18/2013

	This file was adapted from Jesse Heines. Original header block follows:

	Copied File:  /~heines/91.461/91.461-2012-13f/461-lecs/code/j1.html
	Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
	Copyright (c) 2012 by Jesse M. Heines.  All rights reserved.  May be freely 
	copied or excerpted for educational purposes with credit to the author.
	
	This is my assignment #3 page.

      -->
<html>
  <head>
    <link href="RESET.css" rel="stylesheet" type="text/css" /> 
    <link href="common.css" rel="stylesheet" type="text/css" />
    <link href="a3.css" rel="stylesheet" type="text/css" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Assignment 3</title>
    <script>

      /* 
        I intentionally chose to leave this single javascript function in here.
        That way, it leaves all the goodness in one place and reduces the file count by one.
      */

      /* 
         This function is used to toggle the visibility of an object.
         Returns false if the id passed is not found in the document, true otherwise.
      */
      function toggleVisibilityOn(strElementID, strDisplayAttribute)
      {

        // get a reference to the object we want to alter
        var theObjectToStyle = document.getElementById(strElementID);

        // ensure we found the object, otherwise return false.
        if( theObjectToStyle === null )
        {
          console.warn("toggleVisibilityOn(): cannot find anything with ID '" + strElementID + "'...");
          return false;
        }

        // maintainer note: the object.style.display doesn't seem to have a value initially.
        // The logic works just so that the first button press will enable the display.
        // The object is intially hidden. keep this in mind if/when modifying!


        if ( theObjectToStyle.style.display != "none" &&
             theObjectToStyle.style.display != ""        )
          {
            theObjectToStyle.style.display = "none" ;
          }

        else
        {
          // set the object's visiblity to the 2nd argument of this call if we passed one,
          // "block" otherwise.
          theObjectToStyle.style.display = (strDisplayAttribute == null) ? 
                                            "block" : 
                                            strDisplayAttribute ; 
        }

        return true ;
      }
    </script>

  </head>
  <body>
    <!--  
	  here's my navbar! 
	  note the round-edged class: the div and the ul MUST HAVE THE SAME border-radius value.
	  that's why the round-edged class appears twice here:
	  this design decision avoids the style breaking later.
      -->
    <div  id="navbar"  class="navbar round-edged" >
      <ul  class="horizontal-list round-edged">
        <li><a href="index.html">Nick St.Pierre</a></li>
        <li>Placeholder1</li>
        <li>Placeholder2</li>
        <li>Placeholder3</li>
      </ul>
    </div>
    <!-- this div used to achieve one big solid background. -->
    <div class="backgroundBox round-edged">

      <h1>
        Assignment 3
      </h1>
      <br>
      <p>
	Welcome to my third GUI assignment page. This page is styled with css3. Please note the CSS reset in the source.
      </p>
      <p>
	Please enjoy the navbar, background image, boxy-layout, and the animation on the following button.
      </p>

      <?php
        //echo "PHP" ;
       ?>
      <br>
      <button id="sound-button" onmouseup="toggleVisibilityOn('soundcloudWidget','block');">♫</button>
      <!-- the music note ascii character thanks to  
	   http://www.diggz.org/index.php/2009/05/15/how-to-make-music-notes-love-hearts-and-other-cutsy-symbols-in-facebook-status-updates-and-chat/ -->

      <!-- Here's a widget to my first set on soundcloud. (good idea curran, just finished up a track in time for this assignment) -->
      <div id="soundcloudWidget">
	<iframe  id="scframe" src="http://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F10563719"></iframe>
      </div>
    </div> <!-- close the background div -->
  </body>
</html>
