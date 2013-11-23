/**
 * Nicholas St.Pierre
 * nstpierr@cs.uml.edu
 * 10.22.2013
 * 
 * Student of UML CS course 91.461, GUI Programming, 
 * taught by professor Jesse Henines
 * 
 * 
 * 
 * 
 * 
 */







/**
 * Simple function to test if an object is null.
 * @param {type} thing Object to test
 * @returns {Boolean}
 */
function isNULL(thing)
{
  return thing === null ;
}



/**
 * Tool to validate the input!
 * Scrapes the values directly out of the document.
 * @returns {Boolean} True if valid, false otherwise
 */
function validateInput()
{

  var elemCols      = document.getElementById("inputCols"     );
  var elemStartCols = document.getElementById("inputStartCols");
  var elemRows      = document.getElementById("inputRows"     );
  var elemStartRows = document.getElementById("inputStartRows");


  /* dev error catching: */
  if( isNULL(elemCols) )
  {
      console.error("null element found inputCols");
      return false;
  }
  if( isNULL(elemRows)  ) 
  {
      console.error("null element found inputRows");
      return false;
  }
  if( isNULL(elemStartCols) ) 
  {
      console.error("null element found inputStartCols");
      return false;
  }

  if( isNULL(elemStartRows) )
  {
      console.error("null element found inputStartRows");
      return false;
  }


  /* remove highlighting */
  elemCols.style.backgroundColor="#ffffff";
  elemRows.style.backgroundColor="#ffffff";
  elemStartCols.style.backgroundColor="#ffffff";
  elemStartRows.style.backgroundColor="#ffffff";


  /* numberic verification*/
  var numCols      = parseInt(elemCols.value.trim());
  var numRows      = parseInt(elemRows.value.trim());
  var numStartCols = parseInt(elemStartCols.value.trim());
  var numStartRows = parseInt(elemStartRows.value.trim());



  if( ! isFinite(numCols) || numCols < 1 )
  {
    alert("Error on input! Please enter a valid, non-negative column number.");
    elemCols.focus();
    elemCols.style.backgroundColor="#ffaa55";
    return false;

  }

  if( ! isFinite(numRows) || numRows < 1 )
  {
    alert("Error on input! Please enter a valid, non-negative row number.");
    elemRows.focus();
    elemRows.style.backgroundColor="#ffaa55";
    return false;
  }

  if( ! isFinite(numStartRows) )
  {
    alert("Error on input! Please enter a valid row start number.");
    elemStartRows.focus();
    elemStartRows.style.backgroundColor="#ffaa55";
    return false;
  }

  if( ! isFinite(numStartCols) )
  {
    alert("Error on input! Please enter a valid row start number.");
    elemStartCols.focus();
    elemStartCols.style.backgroundColor="#ffaa55";
    return false;
  }


  console.log("validation passed");
  return true;


}




/**
 * Makes a table if possible!
 * Looks for input in the URL, gets it using Professor Heines' getParameter(),
 * and generates a table html string, and puts it inthe html element with id 
 * "output".
 * 
 * @returns {nothing!}
 */
function makeTableIfPossible()
{

  /* hastily obtain all the values. */
  var numCols      = parseInt(getParameter("inputCols").trim());
  var numRows      = parseInt(getParameter("inputRows").trim());
  var numStartCols = parseInt(getParameter("inputStartCols").trim());
  var numStartRows = parseInt(getParameter("inputStartRows").trim());


  /* a little extra validation never hurt us in the development phase... */
  if(  isFinite(numCols)      &&
       isFinite(numRows)      && 
       isFinite(numStartRows) &&
       isFinite(numStartCols) )
  {

      var elemOutput = document.getElementById("output");

      // dev error check
      if( isNULL(elemOutput) )
      {
        console.error("element with ID 'output' expected but not found.");
        return;
      }

      var retstr = "<table id='outputTable'>\n<tr><td></td>\n"; // insert the header row and a filler-cell


      for ( var i = 0 ; i < numCols ; i++) // note that i < numCols (not <=) because we have the blank cell in this row
      {
          retstr += "<td>"+(i+numStartCols)+"</td>\n" ;
      }


      for ( var i = 0 ; i < numRows ; i++)
      {

         retstr+="<tr>\n<td>"+(i+numStartRows)+"</td>\n"; // insert a new row AND insert the first cell in it.

         for ( var j = 0 ; j < numCols ; j++ )
         {
             retstr+="<td>"+((i+numStartRows)*(j+numStartCols))+"</td>\n";       
         }

         retstr+="</tr>\n";

      }


      retstr+="</table>";

      elemOutput.innerHTML = retstr;

  }
  else
  {
      console.log("the url args are bad.");
  }

  return;
}



/**
 * Here's my first prototype function!
 * If the assignment's definition didn't change, I would have rolled with this solution.
 * But alas! We are flexible.
 * 
 * We left this here for fun. It isn't used anywhere in this progaram/site.
 * 
 * It scrapes the page without sending the form.
 * @returns {Boolean} true if ok, false on error
 */
function makeTableFromForm()
{

  var elemCols      = document.getElementById("inputCols"     );
  var elemStartCols = document.getElementById("inputStartCols");
  var elemRows      = document.getElementById("inputRows"     );
  var elemStartRows = document.getElementById("inputStartRows");


  if( isNULL(elemCols)      || 
      isNULL(elemRows)      || 
      isNULL(elemStartCols) || 
      isNULL(elemStartRows)    )
  {
    console.error("null element found");
    return false;
  }

  var numCols    = parseInt(elemCols.value);
  var numRows    = parseInt(elemRows.value);
  var numStartCols = parseInt(elemStartCols.value);
  var numStartRows = parseInt(elemStartRows.value);



  if( !(isNaN(numCols)      || 
        isNaN(numRows)      || 
        isNaN(numStartRows) || 
        isNaN(numStartCols) ))
  {

      var elemOutput = document.getElementById("output");

      if( isNULL(elemOutput))
      {
        console.error("element with ID 'output' expected but not found.");
        return;
      }

      var retstr = "<table id='outputTable'>\n<tr><td></td>\n"; // insert the header row and a filler-cell


      // make the table header row
      for ( var i = 0 ; i < numCols ; i++) // note that i < numCols (not <=) because we have the blank cell in this row
      {
          retstr += "<td>"+(i+numStartCols)+"</td>\n" ;
      }


      // make the table body
      for ( var i = 0 ; i < numRows ; i++)
      {

         retstr+="<tr>\n<td>"+(i+numStartRows)+"</td>\n"; // insert a new row AND insert the first cell in it.

         // make a row
         for ( var j = 0 ; j < numCols ; j++ )
         {   // make one cell
             retstr+="<td>"+((i+numStartRows)*(j+numStartCols))+"</td>\n";       
         }

         // end of row
         retstr+="</tr>\n";

      }


      retstr+="</table>";

      elemOutput.innerHTML = retstr;
      
  }
  else
  {
      console.log("args are bad");
      return false;
  }

}
