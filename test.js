//JS object - Stack

var stack = function()
{
  this.vArr = [];

  this.Push = function(item){
    this.vArr.push(item);
  };
  this.Pop = function(){
    this.vArr.pop();
  }
};


var myObj = new stack();

myObj.Push(1);
myObj.Push(2);
myObj.Pop();