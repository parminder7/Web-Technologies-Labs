	<?php include("top.html"); ?>
	<?php include ("common.php"); ?>
    <?php
	$firstname = $_REQUEST['firstname'];
	$lastname = $_REQUEST['lastname'];
 	/*
	print "Firstname: $firstname";
	print "Lastname: $lastname";
	*/
	$count = 0;
	$flag = 0;
	
    try {
		$errorMsg = "";
		$validFName = "/^([A-Z][a-z.]*)$/i";
		$validLName = "/^([A-Z][a-z.]*)$/i";
		
		if((! preg_match ($validFName, $firstname)) || ($firstname=="")){
			$errorMsg = "$errorMsg<li>Invalid first name</li>";
		}
		if((! preg_match ($validLName, $lastname)) || ($lastname=="")){
			$errorMsg = "$errorMsg<li>Invalid last name</li>";
		}
		
	  if($errorMsg==""){
	  
		$check = $db->query("SELECT * from actors where first_name LIKE '$firstname%' AND last_name='$lastname'");
		$selectname = $firstname;
	   
	   /*
		*	If there exists more than one person with same name than
		*	the actor who has appeared in the most movies, breaking 
		*	ties by choosing the actor with the lower-numbered ID.
	   */
		do{
			$val = 0;
			$num = 0;
			foreach($check as $r){
				if($r['film_count'] == $val){
					if($r['id'] > $num){
						continue;
					}
				}
				else if($r['film_count'] > $val){
					$val = $r['film_count'];
					$selectname = $r['first_name'];
				}
				$num = $r['id'];
			}
		}while($check->rowCount() > 1);
		
		//Pass $selectname as firstname in SQL query
		//print $selectname;
		
       $rows = $db->prepare ("SELECT a.id, m.name, m.year FROM actors AS a, movies AS m, roles AS r  
                                WHERE a.id = r.actor_id AND m.id = r.movie_id AND a.first_name=:fname AND a.last_name=:lname 
                                    ORDER BY m.year DESC, m.name");
									
	    //To avoid SQL injection
	   $rows->bindValue (":fname", $selectname);
	   $rows->bindValue (":lname", $lastname);
	   $rows->execute();
	  }
		else{
			$flag=1;
			echo("<ul>" . $errorMsg . "</ul>\n");
		}
     }
	 catch (PDOException $e) {
       header ("HTTP/1.1 500 Server Error");
       die    ("HTTP/1.1 500 Server Error: Error reading from database: {$e->getMessage()}");
     }
	
	?>
	<?php if ($flag==0 && ($rows->rowCount() > 0)) { $count=1;?>
	<h1>Result for <?php print "$firstname $lastname"; ?></h1>
		
		<table>
		<caption>Movies of $firstname $lastname</caption>
		<tr>
			<th>#</th>
			<th>Title</th>
			<th>Year</th>
		</tr>
		<?php foreach ($rows as $rowIndex => $row){ ?>
		<tr>
			<td><?php print ++$count; ?></td>
			<td><?php print $row['name']; ?></td>
			<td><?php print $row['year']; ?></td>
		</tr>
		<?php } ?>
		</table>	
		<?php } 
				else if(!($flag==1)){
					print "$firstname $lastname not found";
				}?>
		
	<?php include("bottom.html"); ?>