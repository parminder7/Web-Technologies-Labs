<?php
/**
 * Name: Parminder Jeet Kaur
 * Student ID: 87224135
 */
include "cow.php";

   $username = $_POST["username"];
    //session_start();
    //$_SESSION["user"] = $_POST["username"];
    if(isset($_SESSION['user'])){
        $filename = 'list_'.$username.'.json';

        $content = "";
        if(file_exists($filename)){
            $content = file_get_contents($filename);
        }
        else{
            $empty = '{"name":"'. $username.'", "list": []}';
            $fp = fopen($filename, 'w');
            fwrite($fp, $empty);
            fclose($fp);
        }

        echo $content;
    }
    else{
        print('{
                        "status" : [{"type" : "FAIL"}]
                  }
            ');
    }
?>
