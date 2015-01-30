"use strict";
var GET = "./cowGet.php";
var LOGIN = "./cowLogin.php";
var UPDATE = "./cowUpdate.php";
var LOGOUT = "./cowLogout.php";

/**
 * This will call GET via ajax, display depends on whether the user is loggin.
 */
document.observe("dom:loaded", function() {
	getlist("testuser");
});

/**
 * Call the LOGIN via ajax and return a json to display the login page.
 */
function login() {
	new Ajax.Request(LOGIN, {
		method : "post",
		parameters : {
			username : $("username").value,
			password : $("password").value
		},
		onSuccess : function(ajax) {
			var stat = JSON.parse(ajax.responseText);
			if (stat.loginStatus == "success") {
				$("errorMessage").addClassName("hidden");
				getlist(stat.username);
			} else {
				showLoginFailMessage("Invalid Username or Password.");
			}
		},
		onFailure : function(ajax) {
			showLoginFailMessage("Connection failure.");
		}
	});
}

/**
 * Retrieve the the json file if the user login.
 * 
 * @param username
 */
function getlist(username) {
	new Ajax.Request(GET, {
		method : "post",
		parameters : {
			username : username
		},
			onSuccess : function(ajax) {
			var reply = JSON.parse(ajax.responseText);
			if (reply.username == "") {
				buildLoginPage();
				$("body").fade({
					duration : 1.0,
					from : 0,
					to : 1
				});
			} else {
				buildToDoListPage(reply);
				$("main").fade({
					duration : 1.0,
					from : 0,
					to : 1
				});
			}
		},
		onFailure : function() {
			buildLoginPage();
		}
	});
}

/**
 * Logout via a json to call LOGOUT to destroy the session, redisply the login
 * page.
 * 
 * @param event
 * @param username
 */
function logout(event, username) {
	$("main").disable = true;
	new Ajax.Request(LOGOUT, {
		method : "post",
		parameters : {
			username : username
		},
		onSuccess : function() {
			buildLoginPage();
			$("main").fade({
				duration : 1.0,
				from : 0,
				to : 1
			});
		}
	});
}

/**
 * Update the list via a json to call UPDATE and reconstruct a sortable list.
 * 
 * @param newjson
 */
function update(newjson) {
	new Ajax.Request(UPDATE, {
		method : "post",
		parameters : {
			json : newjson
		},
		onSuccess : function(ajax) {
			var reply = JSON.parse(ajax.responseText);
			buildToDoListPage(reply);
		}
	});
}

/**
 * For test.
 */
function alertme() {
	alert("me");
}

/**
 * Evenhandler for adding a new items in the bottom.
 * 
 * @param event
 * @param username
 */
function add(event, username) {
	var input = $("inputText").value;
	// only when there is non-whitespace input text.
	if (input.replace(/^\s+|\s+$/g, '') != "") {
		var newjson = getListOnScreen(username);
		newjson["items"][newjson["items"].length] = input.escapeHTML();
		update(JSON.stringify(newjson));
		setTimeout(function() {
			$("todoList_" + (newjson["items"].length - 1)).pulsate({
				duration : 0.5,
				pulses : 1
			});
		}, 200);
	}
}

/**
 * Eventhandler for delete the top item.
 * 
 * @param event
 * @param username
 */
function del(event, username) {
	$("todoList_0").fade({
		duration : 0.5,
		from : 1,
		to : 0
	});
	var newjson = getListOnScreen(username);
	newjson["items"].shift();
	setTimeout(function() {
		update(JSON.stringify(newjson));
	}, 1000);
}

/**
 * Evenhandler for the onUpdate event in the sortable list.
 * 
 * @param event
 * @param username
 */
function sort(event, username) {
	update(JSON.stringify(getListOnScreen(username)));
}

/**
 * Get all the items currently on the to-do list.
 * 
 * @param username
 * @returns {___anonymous3069_3070}
 */
function getListOnScreen(username) {
	var newjson = {};
	newjson["username"] = username;
	newjson["items"] = [];
	if ($("todoList").hasChildNodes()) {
		var nodes = $("todoList").childNodes;
		for ( var i = 0; i < nodes.length; i++) {
			newjson["items"][i] = nodes[i].innerHTML;
		}
	} else {
	}
	return newjson;
}

function showLoginFailMessage(errorMsg) {
	$("errorMessage").innerHTML = errorMsg;
	$("errorMessage").removeClassName("hidden");
	$("errorMessage").pulsate({
		duration : 0.8,
		pulses : 2
	});
}

/**
 * Build the login page.
 */
function buildLoginPage() {
	// remove the todoListPage if it exists.
	if ($("main").contains($("todoListPage"))) {
		$("main").removeChild($("todoListPage"));
	}
	if ($("main").contains($("loginPage"))) {
		$("main").removeChild($("loginPage"));
	}

	// define a root div for the login page.
	var rootDiv = document.createElement("div");
	rootDiv.setAttribute("id", "loginPage");

	// add the texts.
	rootDiv.appendChild(makeSimpleDOMNode("p",
			"The best way to manage your tasks."));
	rootDiv.appendChild(makeSimpleDOMNode("p",
			"Never forget the cow (or anything) again!"));
	rootDiv.appendChild(document.createElement("br"));
	rootDiv.appendChild(makeSimpleDOMNode("p",
			"Log in now to manage your to-do list:"));
	rootDiv.appendChild(document.createElement("br"));

	// add the login input fields
	var inputDiv = document.createElement("div");
	inputDiv.setAttribute("id", "loginElements");

	// add the username input text field
	inputDiv.appendChild(new Element("input", {
		id : "username",
		type : "text",
		value : "testuser",
		size : "12"
	}));
	inputDiv.appendChild(document.createTextNode("User Name"));
	inputDiv.appendChild(document.createElement("br"));

	// add the password field.
	inputDiv.appendChild(new Element("input", {
		id : "password",
		type : "password",
		value : "testpass",
		size : "12"
	}));
	inputDiv.appendChild(document.createTextNode("Password"));
	inputDiv.appendChild(document.createElement("br"));

	// add the login button
	inputDiv.appendChild(new Element("button", {
		id : "loginButton"
	})).appendChild(document.createTextNode("Log in"));
	rootDiv.appendChild(inputDiv);

	// add the error message div
	var errorMsgDiv = document.createElement("div");
	errorMsgDiv.setAttribute("id", "errorMessage");
	errorMsgDiv.appendChild(document.createTextNode("Error Message"));
	rootDiv.appendChild(errorMsgDiv);

	// add the login div to main
	$("main").appendChild(rootDiv);

	// set the errorMessage div as hidden in the beginning
	$("errorMessage").addClassName("hidden");

	// set the event handler for the button
	$("loginButton").observe("click", login);
}

/**
 * Build the to-do list page based on a replying json.
 * 
 * @param reply
 */
function buildToDoListPage(reply) {
	// remove the loginpage
	if ($("main").contains($("loginPage"))) {
		$("main").removeChild($("loginPage"));
	}
	if ($("main").contains($("todoListPage"))) {
		$("main").removeChild($("todoListPage"));
	}

	// create the to-do list header
	var rootDiv = document.createElement("div");
	rootDiv.setAttribute("id", "todoListPage");
	rootDiv.appendChild(makeSimpleDOMNode("h2", 
			reply.username.charAt(0).toUpperCase() +
			reply.username.slice(1) + "'s To-Do List:"));

	// create the to-do list div and append to the root div
	var todoListDiv = document.createElement("div");
	todoListDiv.setAttribute("id", "todoListDiv");
	var todoListList = document.createElement("ul");
	todoListList.setAttribute("id", "todoList");
	for ( var i = 0; i < reply.items.length; i++) {
		var li = makeSimpleDOMNode("li", reply.items[i]);
		li.setAttribute("id", "todoList_" + i);
		todoListList.appendChild(li);
	}
	todoListDiv.appendChild(todoListList);
	rootDiv.appendChild(todoListDiv);

	// create the input and buttons
	var textInput = makeIdDOMNode("input", "inputText");
	textInput.setAttribute("type", "text");
	textInput.setAttribute("size", "30");
	rootDiv.appendChild(textInput);
	rootDiv.appendChild(new Element("button", {
		id : "addButton"
	})).appendChild(document.createTextNode("Add to Bottom"));
	rootDiv.appendChild(new Element("button", {
		id : "deleteButton"
	})).appendChild(document.createTextNode("Delete Top Item"));

	// create the logout link div and append to the root div
	var logoutDiv = makeIdDOMNode("div", "logoutDiv");
	var logoutList = document.createElement("ul");
	var logoutListItem = document.createElement("li");
	var logoutLink = makeIdDOMNode("a", "logoutLink");
	logoutLink.setAttribute("href", "#");
	logoutLink.appendChild(document.createTextNode("Log Out"));
	logoutListItem.appendChild(logoutLink);
	logoutList.appendChild(logoutListItem);
	logoutDiv.appendChild(logoutList);
	rootDiv.appendChild(logoutDiv);

	// append the root div to main
	$("main").appendChild(rootDiv);

	// make a sortable list and bind the onUpdate handler.
	Sortable.create("todoList", {
		onUpdate : function(event) {
			sort(event, reply.username);
		}
	});

	// set the event handlers for the buttons and link
	$("addButton").observe("click", function(event) {
		add(event, reply.username);
	});
	$("deleteButton").observe("click", function(event) {
		del(event, reply.username);
	});
	$("logoutLink").observe("click", function(event) {
		logout(event, reply.username);
	});
}

/**
 * Make a simple text DOM node.
 * 
 * @param tagName
 * @param text
 * @returns {___simpleNode0}
 */
function makeSimpleDOMNode(tagName, text) {
	var simpleNode = document.createElement(tagName);
	simpleNode.innerHTML = unescape(text);
	return simpleNode;
}

/**
 * Make a DOM node with id.
 * 
 * @param tagName
 * @param id
 * @returns
 */
function makeIdDOMNode(tagName, id) {
	var idNode = document.createElement(tagName);
	idNode.setAttribute("id", id);
	return idNode;
}

// end object niuzhibi