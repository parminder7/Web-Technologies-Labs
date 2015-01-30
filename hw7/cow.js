/**
 * Name: Parminder Jeet Kaur
 * Student ID: 87224135
 * Note:
 *      added global variables for commonly used php file names
 *      removed the redundant code by adding helper methods
 */
"use strict";
//var MAIN = "./cow.php";   //not used locally
var GET = "./cowGet.php";
var LOGIN = "./cowLogin.php";
var LOGOUT = "./cowLogout.php";
var UPDATE = "./cowUpdate.php";
//same as window.onload
document.observe("dom:loaded", loginPage);

/**
 * This method renders the login page view
 */
function loginPage(){
    //remove todoPage if it already exist
    if($("mainContent").contains($("todo"))){
        $("mainContent").removeChild($("todo"));
    }

    //root div for login content
    var rootDiv = makeNodeandSetID("div", "login");

    //add the contents
    rootDiv.appendChild(document.createElement("br"));
    rootDiv.appendChild(makeNode("p", "The best way to manage your tasks."));
    rootDiv.appendChild(makeNode("p", "Never forget the cow (or anything else) again!"));
    rootDiv.appendChild(makeNode("p", "Log in now to manage your to-do list:"));
    rootDiv.appendChild(document.createElement("br"));

    //add username input field
    var credsDiv = makeNodeandSetID("div", "creds");
    credsDiv.appendChild(new Element("input", {
        id: "username",
        type: "text",
        placeholder: "username",
        size: "12"
    }));
    credsDiv.appendChild(document.createTextNode("User Name"));
    credsDiv.appendChild(document.createElement("br"));

    //add password input field
    credsDiv.appendChild(new Element("input", {
        id: "password",
        type: "text",
        placeholder: "password",
        size: "12"
    }));
    credsDiv.appendChild(document.createTextNode("Password"));
    credsDiv.appendChild(document.createElement("br"));

    //add login button
    credsDiv.appendChild(new Element("button",{
        id: "loginButton"
    })).appendChild(document.createTextNode("Log in"));

    rootDiv.appendChild(credsDiv);
    //add a div for error message
    var errMsgDiv = document.createElement("div");
    errMsgDiv.setAttribute("id", "errMsg");
    errMsgDiv.appendChild(document.createTextNode("My error messages"));
    rootDiv.appendChild(errMsgDiv);

    //add login div to mainContent div
    $("mainContent").appendChild(rootDiv);

    //keep errMsgDiv hidden
    $("errMsg").addClassName("hidden");

    //set event handler on login button
    $("loginButton").observe("click", loginFun);
}

/**
 * This method renders the to do list page view
 * @param user
 * @param olist
 */
function todoPage(user, olist){
    //remove login page if it already exists
    if($("mainContent").contains($("login"))){
        $("mainContent").removeChild($("login"));
    }
    if($("mainContent").contains($("todo"))){
        $("mainContent").removeChild($("todo"));
    }

    //root div for todoList content
    var rootDiv = makeNodeandSetID("div", "todo");

    //add header to todoList
    var headerDiv = makeNodeandSetID("div", "header");
    headerDiv.appendChild(makeNode("h2", user +"'s to do List"));

    //add to do list by creating div
    var listDiv = makeNodeandSetID("div", "listDiv");

    var todoList = makeNodeandSetID("ul", "list");

    for(var i = 0; i < olist.length; i++){
        var bullet = makeNode("li", olist[i]);
        bullet.setAttribute("id", "element_"+i);
        todoList.appendChild(bullet);
    }
    listDiv.appendChild(todoList);

    //add input field
    var controlPanel = makeNodeandSetID("div", "controlPanel");
    controlPanel.appendChild(new Element("input", {
        id: "inputTxt",
        type: "text",
        size: "30"
    }));

    //add add button
    controlPanel.appendChild(new Element("button",{
        id: "addBtn"
    })).appendChild(document.createTextNode("Add to bottom"));

    //add delete button
    controlPanel.appendChild(new Element("button",{
        id: "delBtn"
    })).appendChild(document.createTextNode("Delete top item"));

    //add logout div
    var logoutDiv = makeNodeandSetID("div", "logoutDiv");
    var logoutList = document.createElement("ul");
    var logoutListItem = document.createElement("li");
    var logoutAnchor = makeNodeandSetID("a", "logoutAnchor");
    logoutAnchor.appendChild(document.createTextNode("Log Out"));
    logoutAnchor.setAttribute("href", "#");
    logoutListItem.appendChild(logoutAnchor);
    logoutList.appendChild(logoutListItem);
    logoutDiv.appendChild(logoutList);

    //add to mainContent div
    rootDiv.appendChild(controlPanel);
    rootDiv.appendChild(headerDiv);
    rootDiv.appendChild(listDiv);
    rootDiv.appendChild(logoutDiv);
    $("mainContent").appendChild(rootDiv);

    //set a sortable list
    Sortable.create("list",{
       onUpdate : function(event){
           listUpdate(event, user);
       }
    });

    //set event handler on buttons
    $("addBtn").observe("click", function(event){
        addToList(event, user);
    });
    $("delBtn").observe("click", function(event){
        delFromList(event, user);
    });
    $("logoutAnchor").observe("click", function(event){
        logout(event, user);
    });
}

/**
 * Helper method: for creating node with text node
 * @param tag
 * @param text
 * @returns {HTMLElement}
 */
function makeNode(tag, text){
    var node = document.createElement(tag);
    node.innerHTML = text;
    return node;
}

/**
 * Helper method: for creating node with specified id
 * @param tag
 * @param id
 * @returns {HTMLElement}
 */
function makeNodeandSetID(tag, id){
    var newNode = document.createElement(tag);
    newNode.setAttribute("id", id);
    return newNode;
}

/**
 * This method is called on the click event of login button
 */
function loginFun(){
    new Ajax.Request(LOGIN,{
        method: "POST",
        parameters: {
            username: $("username").value,
            password: $("password").value
        },
        onSuccess : function(ajax){
	  try{
            var result = JSON.parse(ajax.responseText);
            if (result.status[0].type == "SUCCESS"){
                //alert("success");         //for testing
                getList("testuser");
            }
            else{
                //alert("failure");     //for testing
                $("creds").shake();
            }
   	   }
	   catch(e){
	   	alert("Exception caught");
	   }
        },
        onFailure : function(ajax){
            alert("Login : Unexpected error");
        }
    });
}

/**
 * This method is called while rendering list view
 * @param user
 */
function getList(user){
    //alert("getList"+user);        //for testing
    new Ajax.Request(GET, {
        method : "POST",
        parameters: {
            username : user
        },
        onSuccess : function(ajax){
            //alert("here");        //for testing
            var objects = JSON.parse(ajax.responseText);

            /*
            //retrieve the list of corresponding user
            var index;
            for (var j = 0; j < objects.entry.length; j++){
                alert(objects.entry[j]["name"]);
                if (objects.entry[j]["name"] == user){
                    index = j;
                    break;
                }
            }
            */
            /*
            if(objects.status[0].type == "FAIL"){
                alert("Oops! Session expired.");
            }
            */
            todoPage(user, objects.list);

            $("mainContent").fade({
                duration : 1.0,
                from : 0,
                to : 1
            });

            $("list").hide();
            $("list").appear();

        },
        onFailure : function(ajax){
            alert("getList : Unexpected error");
        }
    });
}

/**
 * This method is called on the click event of add button
 * @param event
 * @param user
 */
function addToList(event, user){
    //alert("addtolist");           //for testing
    var newVal = $("inputTxt").value;

    if(newVal != ""){
        var currjsonnode = getCurrList(user);
        //alert("currjson"+currjsonnode);       //for testing
        currjsonnode["list"][currjsonnode["list"].length] = newVal.escapeHTML();
        todoPage(user, currjsonnode["list"]);
        updateJson(user, JSON.stringify(currjsonnode));
    }
}

/**
 * Helper method: for retrieving elements of list which is currently there on user's window
 * @param user
 * @returns {{}}
 */
function getCurrList(user){
    //alert("getCurrList");     //for testing
    var curList = {};
    curList["name"] = user;
    curList["list"] = [];

    var items = $("list").childNodes;
    //alert("items="+items.length);     //for testing
    for(var it = 0; it < items.length; it++){
        curList["list"][it] = items[it].innerHTML;
        //alert("----"+curList["list"][it]);        //for testing
    }
    return curList;
}

/**
 * This method is called on the click event of add for updating corresponding user's json file
 * @param user
 * @param newjsonnode
 */
function updateJson(user, newjsonnode){
    //alert("updateJson");      //for testing
    new Ajax.Request(UPDATE,{
        method: "POST",
        parameters:{
            user : user,
            newjson : newjsonnode
        },
        onSuccess: function(ajax){
            var response = JSON.parse(ajax.responseText);

            if(response.status[0].type == "NEW_USER"){
                //append to list on screen
                alert("Hello your first list is created!");
            }
            if(response.status[0].type == "FAIL"){
                alert("Ooops! Session expired.");
            }
        },
        onFailure : function(ajax){
            alert("updateJson : Unexpected error");
        }
    });
}

/**
 * This method is called on the click event of delete button
 * @param event
 * @param user
 */
function delFromList(event, user){
    var newjson = getCurrList(user);
    newjson["list"].shift();
    todoPage(user, newjson["list"]);
    $("listDiv").shake();
    updateJson(user, JSON.stringify(newjson));
}

/**
 * This method is called on the click event of logout link
 * @param event
 * @param user
 */
function logout(event, user){
    new Ajax.Request(LOGOUT,{
        method: "POST",
        parameters:{
            user : user
        },
        onSuccess: function(ajax){
            var result = JSON.parse(ajax.responseText);
            if(result.status[0].type == "SUCCESS"){
                alert("Logout successfully");
            }
            else if(result.status[0].type == "INVALID_ACCESS"){
                alert("Unauthorized access");
            }
            else{
                alert("Session safely ended");
            }
            loginPage();
            $("mainContent").fade({
                duration : 1.0,
                from : 0,
                to : 1
            });
        },
        onFailure: function(ajax){
            alert("logout : Unexpected error");
        }
    });
}

/**
 * This method updates the list element's position as sorted
 * @param event
 * @param user
 */
function listUpdate(event, user){
    var newlist = getCurrList(user);
    updateJson(user, JSON.stringify(newlist));
}