/**

    nicholas st.pierre

    php includes file

    contains table stuff

*/


function tableRow($arrayOfCells)
{

    $retstr = "";

    foreach($arrayOfCells as $td)
    {
        $retstr .=  "<td>$td</td>" ;
    }

    return $retstr;
}


function tableGuts($array2OfCells)
{

    $retstr = "";

    foreach($array2OfCells as $rowArray)
    {
        $retstr .= "<tr>".tableRow($rowArray)."</tr>";
    }

    return $retstr;

}


