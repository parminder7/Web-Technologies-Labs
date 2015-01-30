<?php
/**
 * Name: Parminder Jeet Kaur
 * Student ID: 87224135
 */
 include "cow.php";

    if(isset($_SESSION['user'])){
        $user = $_POST["user"];
        $node = $_POST["newjson"];
/*
    if(file_exists("todolist.json")){
        $file = file_get_contents("todolist.json");
        $data = json_decode($file, true);
    }

    $index = 0;

    //position of particular user
/**
 * Version 1.0 :
 * In this version, I considered to keep multiple user records in one file.
 * In that json file, I was updating the particular record corresponding to requested user.
 *
 * Version 2.0 :
 * Same as assignment
 */
/*
    for($i = 0; $i < $data['entry'].length; $i++){
        if ($data[$i]['name'] == $user){
            $index = $i;
            break;
        }
    }

    unset($data['entry'][$index]);
    $arrne['name'] = $user;
    $arrne['list'] = $list;
    array_push($data['entry'], $arrne);
    file_put_contents('todolist.json', json_encode($data));
*/

        $filename = 'list_'.$user.'.json';
        $STATUS = "";
        if(file_exists($filename)){
            $STATUS = "OLD_USER";
        }
        else{
            $STATUS = "NEW_USER";
        }

        $fp = fopen($filename, 'w');
        fwrite($fp, $node);
        fclose($fp);

        print('{
                        "status" : [{"type" : "'.$STATUS.'"}]
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