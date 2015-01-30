<?php
/**
 * Name: Parminder Jeet Kaur
 * Student ID: 87224135
 */
 include "cow.php";

 if(($_SESSION['user']) == $_POST["user"]){
    unset($_SESSION['user']);
    session_destroy();
    print('{
                        "status" : [{"type" : "SUCCESS"}]
                  }
            ');
 }
 else if(($_SESSION['user']) != $_POST["user"]){
     print('{
                        "status" : [{"type" : "INVALID_ACCESS"}]
                  }
            ');
 }
 else{
     print('{
                        "status" : [{"type" : "FAIL"}]
                  }
            ');
 }
?>