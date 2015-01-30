"use strict";
var playcontent;
var frames;
var frameIndex;
var timer;


/**
 * This method is called when Start button is clicked by the user
*/
function startplay(){
	//save the textarea content 
	playcontent = document.getElementById("playarea").value;
	
	//spilt the contents into frames
	frames = playcontent.split("=====\n");
	
	if(frames.length <= 1){
		alert("Enter some content");
		return;
	}
	//Set stop button and select box of animation enabled
	setElements(true);
	
	frameIndex = 0;
	//Get the first frame
	getNextFrame();
	timer = window.setInterval(getNextFrame, 250);
}

/**
 * This method is called to get next frame
*/
function getNextFrame(){
	document.getElementById("playarea").value = frames[frameIndex];
	frameIndex = (frameIndex + 1) % frames.length;
}

/**
 * This method is called when Stop button is clicked by the user
*/
function stopplay(){
	window.clearInterval(timer);
	timer = null;
	document.getElementById("playarea").value = playcontent;
	
	//Set stop button and select box of animation disabled
	setElements(false);
}

/**
 * This method is called when user chooses any animation option
*/
function runAnimation(){
	var option = document.getElementById("animationOpt").value;
	document.getElementById("playarea").value = ANIMATIONS[option];
}

/**
  * This method is called when user chooses any size option
*/
function changeSize(){
	var option = document.getElementById("sizeOpt").value;
	(document.getElementById("playarea")).style.fontSize = option;
}

/**
  * This method is called when turbo is checked or unchecked
  */
function setTurbo(){
	var speed;
	if (document.getElementById("turboChk").checked){
		speed = document.getElementById("turboChk").value;
	}
	else{
		speed = 250;
	}
	if(timer !== null){
		window.clearInterval(timer);
		timer = window.setInterval(getNextFrame, speed);
	}
}

/**
  * This method enables and disables the element
  */
function setElements(isDisable){
	document.getElementById("animationOpt").disabled = isDisable;
	document.getElementById("stopbutton").disabled =! isDisable;
	document.getElementById("startbutton").disabled = isDisable;
	document.getElementById("turboChk").disabled =! isDisable;
	document.getElementById("turboChk").checked =! isDisable;
	document.getElementById("playarea").readOnly = isDisable;
}
  
