	<?php include("top.html"); ?>
	<?php include ("common.php"); ?>
    <?php	
    try {
       $genres = $db->query ("SELECT genre FROM movies_genres GROUP BY genre");
	   $actors = $db->query ("SELECT id, first_name, last_name FROM actors");
	   $directors = $db->query ("SELECT id, first_name, last_name FROM directors");
     } 
	 catch (PDOException $e) {
       header ("HTTP/1.1 500 Server Error");
       die    ("HTTP/1.1 500 Server Error: Error reading from database: {$e->getMessage()}");
     }
	 
	 try{
	 if ($_SERVER ["REQUEST_METHOD"] == "POST"){
		//Validation pattern
		$validName = "/^([A-Z][a-z.]*)$/";	//only alphabets and starts with capital
		$validyear1   = "/^\\s*([1][7-9]\d{2})\s*$/";  // positive integer with trailing or leading white space
		$validyear2   = "/^\\s*([2][0][0-1][0-4])\s*$/";  // positive integer with trailing or leading white space
		$validrank   = "/^\\s*(\d(.\d)?([0])?)\s*$/";
		
		if (isset($_POST["add"])){
		//	print "I'm Here";
			$errorMsg = "";
			/*
			 *	Generate new movie id by determining the maximum id that
			 *	already exists in database
			*/
			$stmtformovieID = $db->query ("SELECT max(id) as id FROM movies");
			foreach ($stmtformovieID as $mm){
				$new_movieID = $mm['id'];
				}
			$new_movieID = $new_movieID+1;
			//print $new_movieID;
			
			//Query for inserting values in 'movies' table
			$stmtformovies = $db->prepare ("INSERT INTO movies (id, name, year, rank) VALUES (:mid, :mname, :myear, :mrank)");
			
			/*
			 *	Retrieve entered film details 
			*/
			$e_fmname = $_POST['filmname'];
			$e_year = $_POST['year'];
			$e_rank = $_POST['rank'];
			if((isset($_POST['filmname']) && isset($_POST['year']) && isset($_POST['rank']))&&(!$e_fmname=="")&&(!$e_year=="")&&(!$e_rank=="")){			
				if (! preg_match ($validName, $e_fmname)){
					$errorMsg = "$errorMsg<li>Invalid film name: Only alphabets and starts with capital letter</li>";
				}
				if((! preg_match ($validyear1, $e_year)) && (!preg_match ($validyear2, $e_year))){
					$errorMsg = "$errorMsg<li>Invalid year: Must be between 1700-2014</li>";
				}
				if(! preg_match ($validrank, $e_rank)){
					$errorMsg = "$errorMsg<li>Invalid film rank: 0-10</li>";
				}
				
			//	print $e_fmname;
			//	print $e_year;
			//	print $e_rank;
			}
			else{
				$errorMsg = "$errorMsg<li>Film detail is incomplete or invalid!</li>";
			}
			
			//Binding parameters to query for updating 'movies' table
			$stmtformovies->bindValue (":mid", $new_movieID);
			$stmtformovies->bindValue (":mname", $e_fmname);
			$stmtformovies->bindValue (":myear", $e_year);
			$stmtformovies->bindValue (":mrank", $e_rank);
			
			//Query for inserting values in 'roles' and 'actors' table
			$stmtforroles = $db->prepare ("INSERT INTO roles (actor_id, movie_id, role) VALUES (:ractorid, :rmovieid, :rrole)");
			$stmtforactors = $db->prepare ("UPDATE actors SET film_count = film_count+1 WHERE id=:aid");
			
			//Binding parameters to query for updating 'actors' table
			//$stmtforactors->bindValue (":aid", $new_movieID);
			
			/*
			 *	Retrieve selected actors from multiple drop menu
			*/
			$e_actors="";
			if(isset($_POST['selectedActors']) && (!($_POST['selectedActors']==""))){
				$e_actors = $_POST['selectedActors'];
			//comment this loop
				/*for($i=0; $i < count($_POST['selectedActors']); $i++){
						$e_actor = $_POST['selectedActors'][$i];
						print $e_actor;
				}*/
			}
			else{
				$errorMsg = "$errorMsg<li>Please select actors..</li>";
			}
			
			/*
			 *	Retrieve roles of actors
			*/
			$e_roles = $_POST['roles'];
			$e_role = "";
			if(isset($_POST['roles'])&&(!($e_roles == ""))){
				$e_role = explode(",", $e_roles);
				if (count($e_role) != count($_POST['selectedActors'])){
					$errorMsg = "$errorMsg<li>Please specify roles to each actor</li>";
				}
			//	print $e_roles;
			}
			else{
				$errorMsg = "$errorMsg<li>Please mention the roles of actors..</li>";
			}
			
			//Binding parameters to query for updating 'roles' table
			//$stmtforroles->bindValue (":ractorid", $e_ractors);		//later looped
			//$stmtforroles->bindValue (":rmovieid", $new_movieID);
			//$stmtforroles->bindValue (":rrole", $e_rrole);
			
			//Query for inserting values in 'movies_directors' table
			$stmtformoviesdir = $db->prepare ("INSERT INTO movies_directors (director_id, movie_id) VALUES (:mddid, :mdmid)");
			
			/*
			 *	Retrieve selected director name
			*/
			$e_did = $_POST['selectedDir'];
			if(isset($_POST['selectedDir'])&&(!($e_did == ""))){
			//	print $e_did;
			}
			else{
				$errorMsg = "$errorMsg<li>Please select directors..</li>";
			}
			
			//Binding parameters to query for updating 'movies_directors' table
			$stmtformoviesdir->bindValue (":mddid", $e_did);		
			$stmtformoviesdir->bindValue (":mdmid", $new_movieID);
			
			//Query for inserting values in 'movies_genres' table
			$stmtformoviesgen = $db->prepare ("INSERT INTO movies_genres (movie_id, genre) VALUES (:mgmid, :mggen)");
			
			/*
			 *	Retrieve selected genre
			*/
			if(isset($_POST['selectedgenre'])){
				$e_genre = $_POST['selectedgenre'];
			//	print $e_genre;
			}
			else{
				$errorMsg = "$errorMsg<li>Please select movie genre..</li>";
			}
			
			//Binding parameters to query for updating 'movies_genres' table
			$stmtformoviesgen->bindParam (":mggen", $e_genre);		
			$stmtformoviesgen->bindParam (":mgmid", $new_movieID);
			
			/*
			 *	If any field in the form remains incomplete, the insert query
			 *	won't execute and the error message will get displayed.
			*/			
			if($errorMsg != "") 
			{
				echo("<ul>" . $errorMsg . "</ul>\n");
			}else{
				$stmtformovies->execute();
				
				//$stmtforactors->execute();
				
				$stmtforroles->bindParam (":ractorid", $e_ractors);	
				$stmtforroles->bindParam (":rmovieid", $new_movieID);
				$stmtforroles->bindParam (":rrole", $e_rrole);
				
				//Binding parameters to query for updating 'actors' and 'roles' table
				$stmtforactors->bindParam (":aid", $aaid);
					for($i=0; $i < count($_POST['selectedActors']); $i++){
						$e_ractors = $e_actors[$i];
						$aaid = $e_actors[$i];
						$e_rrole = $e_role[$i];
						$stmtforroles->execute();
						$stmtforactors->execute();
					}
				
				$stmtformoviesdir->execute();
				
				$stmtformoviesgen->execute();
				
				$succMsg = "<li>Inserted...! Thanks for your contribution</li>";
				echo("<ol>" . $succMsg . "</ol>");
				}
			}//if
		}//if
	 }//try
	 catch (PDOException $e) {
       header ("HTTP/1.1 500 Server Error");
       die    ("HTTP/1.1 500 Server Error: Error reading from database: {$e->getMessage()}");
     }
	
	?>

	<form method="post">
		<fieldset>
			<legend>Contribute to IMDB</legend>
		
			<span>Film Details:</span>
			<div>
			<input type="text" size = "18" name="filmname" id="fmname" placeholder="Film name">
			<input type="text" size = "8" name="year" placeholder="Release year">
			<input type="text" size = "10" name="rank" placeholder="Rank out of 10">
			</div>
			<br>
			<div>
			<span>Actors:</span><br> 
			<select multiple name = "selectedActors[]">
				<?php foreach($actors as $actor){ ?>
				<option value="<?php print $actor['id']; ?>"><?php print $actor['first_name'].$actor['last_name']; ?></option>
				<?php } ?>
			</select>
			</div>
			<br>
			<div>
			<span>Director:</span> 
			<select name="selectedDir">
				<option value="">_____Select_____</option>
				<?php foreach($directors as $rowIndex => $director){ ?>
				<option value = "<?php print $director['id'];?>">
						<?php print $director['first_name'].$director['last_name']; ?>
				</option>
				<?php } ?>
			</select>
			</div>
			<br>
			<span>Roles of actors:</span>
			<div>
			<input type="text" name="roles" size="52" placeholder="doctor, bishop, scientist...">
			</div>
			<br>
			<div>
			<span>Genre:</span> 
			<select name = "selectedgenre">
				<?php foreach($genres as $genre){ ?>
				<option value="<?php print $genre['genre']; ?>"><?php print $genre['genre']; ?></option>
				<?php } ?>
			</select>
			</div>
			<br>
			<div>
			<input type="submit" name="add" value="Insert into IMDB">
			</div>
		</fieldset>
	</form>
	<br>
<?php include("bottom.html"); ?>