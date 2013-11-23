/**
 * 
 * Nicholas St.Pierre
 * 
 * UML CS Student of GUI 1
 * 
 * 10-5-2013
 * 
 * loadJSON.js
 * 
 * 
 * 
 * This javascript script will set up an event so that we can
 * load the JSON into the page, and then actually load the JSON.
 * 
 */


console.debug("starting loadJSON.js");


/**
 * Holds the object created by loading a JSON file with jQuery.
 * @type object
 */
var article;

jQuery.ajax({
              async: false,
              dataType: "json",
              url: "script/8bitbEtty.json" ,
              success: function( data ) {
                article = data ;
               }
             });


/**
 * Accepts an object specified with JSON and returns an HTML string to render
 * the passed object.
 * 
 * @param {JSON} myJSON
 * @returns {String}
 */
function processJSON( myJSON )
{
  
  // print the object obtained from loading the JSON, to the console.
  console.debug("myJSON= "+myJSON);
 
 /**
  * String we will eventually return, containing the HTML.
  * @type String
  */
  var retStr = "<article>";

  //title
  retStr += "  <h2 class='title'>"+myJSON.title+"</h2>\n";
  
  //author
  retStr += "  <h3 class='author '>"+myJSON.author+"</h3>\n  <br>\n";
  

  var imgStr = "";

  // album cover
  if(myJSON.albumCoverUrl !== null)
  {
      imgStr += "  <img class='albumArt' src='"+myJSON.albumCoverUrl+"'></img>\n";
  }

  
  retStr += " <div class='content'>\n " + imgStr;      
  
  var paraCount = myJSON.body.length;

  for( var i = 0 ; i < paraCount ; i++ )
  {
      retStr += "  <p class='para'>\n    ";
      retStr += myJSON.body[i];
      retStr += "\n  </p>\n";      
  }
  
  //date
  retStr += "  <p class='small'><a href='"+myJSON.origin+"'>article source here.</a> written "+myJSON.date+"</p>\n"; ;

  retStr += " </div>\n</article><br>";
  return retStr;

}


/*
 * We need to use an event because we want to change the innerHTML of the div that will contain the text.
 * However, we cannot reference anything in the body (safely) until the body is completely loaded.
 * So, we add this listener to insert the JSON text after we're done loading.
 * 
 * I used the two following resources to conceive the next line of code:
 * 
 * http://www.quirksmode.org/js/events_advanced.html
 * https://developer.mozilla.org/en-US/docs/Web/Reference/Events?redirectlocale=en-US&redirectslug=DOM%2FMozilla_event_reference
 * http://stackoverflow.com/questions/1033398/execute-javascript-when-page-has-fully-loaded 
 * 
 */


window.onload=function(){ /* loads the JSON into the page. */


   console.log("loadEvent Fired!");

  /* ID of the HTML element containing the JSON */
  var jsonElementId = "_json";


  var jsonContainer = document.getElementById(jsonElementId);

  if ( jsonContainer === null )
  {
      console.warn("No element with ID '" + jsonElementId + "' was found."); // error check.
      return false;
  }

  console.log(article);

  var processedJSON = processJSON( article ); 

  /* TODO fix firefox support.*/
  (jsonContainer.innerHTML === null) ? 
  jsonContainer.textContent = processedJSON :
  jsonContainer.innerHTML   = processedJSON ;

};
