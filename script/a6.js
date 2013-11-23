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



// thank http://jqueryvalidation.org/validate/ for how to validate using .validate()

/**
 * This bit of code handles the validation for the form.
 * It registers .validate with the ready event. 
 * This ensures all objects referenced within the validation function's body are in fact loaded and exist.
 * IT IS GREAT.
 * 
 * Almost EVERYTHING from this function was learned on http://jqueryvalidation.org/validate/
 * Seriously, 85% of this source was copied from http://jqueryvalidation.org/validate/ .
 * 
 */
$(document).ready(function(){

  $("#inputForm").validate({


    // handler for the submit action
    submitHandler: function(form) {
      form.submit();
    },

    // custom function to run on each error element
    showErrors: function(errorMap, errorList) {
      $("#summary").html("Your form contains "
        + this.numberOfInvalids()
        + " errors, see details below.");
      this.defaultShowErrors();
    },

    //focusCleanup: true,
    focusInvalid: true,
    
    highlight: function(element, errorClass) {
        $(element).fadeOut(function() {
          $(element).fadeIn();
          errorClass="bad";
        });
    },

    rules: {

      inputCols:{      
        required: true,
        range: [1,42]
      },
      inputRows:{
        required: true,
        range: [1,42]
      },
      inputStartCols:{      
        required: true,
        number: true
      },
      inputStartRows:{      
        required: true,
        number: true
      }
    },

    messages: {
      inputCols:{      
        required: "Please enter a non negative number in the Column box",
        range: "Please enter a positive number in the Column box"
      },
      inputRows:{      
        required: "Please enter a non negative number in the Row box",
        range: "Please enter a positive number in the Row box"
      },
      inputStartCols:{      
        required: "Please enter a number in the Column start box",
        number: "Please enter a valid number"
      },
      inputStartRows:{      
        required: "Please enter a number in the Row start box",
        number: "Please enter a valid number"
      }
    }
  });
});



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


  var inputCols, inputRows, inputStartCols, inputStartRows;

  if( (inputCols      = getParameter("inputCols"))      === null ||
      (inputRows      = getParameter("inputRows"))      === null ||
      (inputStartCols = getParameter("inputStartCols")) === null ||
      (inputStartRows = getParameter("inputStartRows")) === null  )
  {
    console.debug("Ok: incomplete form input, not making a table.");
    return;
  }

  /* hastily obtain all the values. */
  var numCols      = parseInt(inputCols.trim());
  var numRows      = parseInt(inputRows.trim());
  var numStartCols = parseInt(inputStartCols.trim());
  var numStartRows = parseInt(inputStartRows.trim());


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
