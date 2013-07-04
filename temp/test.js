// you can create a function by passing the
// Function constructor a string of code
var func_multiply = new Function("arg1", "arg2", "return arg1 * arg2;");
console.log(func_multiply(5,10)); // => 50