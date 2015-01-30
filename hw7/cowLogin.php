<?php
/**
 * Name: Parminder Jeet Kaur
 * Student ID: 87224135
 */
 include "cow.php";

    if(isset($_POST["username"]) && isset($_POST["password"])){
        if($_POST["username"] == "testuser" && $_POST["password"] == "testpass"){
            $_SESSION['user'] = $_POST["username"];
            print('{
                        "status" : [{"type" : "SUCCESS"}]
                  }
            ');
        }
        else{
            print('{
                        "status" : [{"type" : "FAIL"}]
                  }
            ');
        }
    }

?>
