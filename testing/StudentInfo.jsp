<html><head><title>Binod Java Solution AJAX </title>
<script type="text/javascript">

function showResult(){

if (window.XMLHttpRequest) { // Mozilla, Safari, ...
httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) { // IE
httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlDoc.async="false"; xmlDoc.load("abc.xml");
var students=xmlDoc.documentElement;
var student = students.childNodes(0);
var rows = students.childNodes.length; v
ar cols = student.childNodes.length;

var body = document.getElementsByTagName("body")[0];
//var tabl = document.createElement("table");
var tabl = document.getElementById("studentinfo");
var tblBody = document.createElement("tbody");

for (var i = 0; i < rows; i++) {
var row = document.createElement("tr");
student = students.childNodes(i);

for (var j = 0; j < cols; j++) {
var cell = document.createElement("td");
var cellText = document.createTextNode(student.childNodes(j).firstChild.text); cell.appendChild(cellText);
row.appendChild(cell);
}

tblBody.appendChild(row);
tabl.appendChild(tblBody);
tabl.setAttribute("border", "2");
}

</script>

</head><body onload="showResult()">
<h2> GET STUDENT INFO </h2><br>

<table id="studentinfo"> <tr bgcolor='red'> <td >Name</td><td>Hostel</td><td>Contact</td> </tr> </table>
</body>
</html>
