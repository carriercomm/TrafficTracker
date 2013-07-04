// define our function with the callback argument
function some_function(arg1, arg2, callback) {
	// // this generates a random number between
	// // arg1 and arg2
	// var my_number = Math.ceil(Math.random() *
	// 	(arg1 - arg2) + arg2);
	// // then we're done, so we'll call the callback and
	// // pass our result
	// callback(my_number);

	if ( arg1 == 5) { console.log("Arvo on 5") }
	else { console.log("Arvo ei ole 5") };

	var value = "callbacki"
	callback(value)
}
// call the function
some_function(6, 15, function(num) {
	// this anonymous function will run when the
	// callback is called
	console.log("callback called! " + num);
});
