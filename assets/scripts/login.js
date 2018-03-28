
function goToCreatePage(){
	location.href = "register";
}

function goToLoginPage(){
	location.href = "/";
}

function goToDashboard(userName){
	location.href = "/dashboard/" + userName;
	// var name = {username: userName};
	// //alert(JSON.stringify(message));
	// 	$.ajax({
 // 		url: '/dashboard',
 // 		datatype: "json",
 // 		type: "POST",
 // 		data: name,
 // 		success: function(response){
 // 			alert(response.success);
 // //  	// 		if(response.success){
 // //  	// 			alert(response.username);
 // //  	// 			goToDashboard();
 // //  	// 		}
 // //  	// 		else{
 // //  	// 			goToLoginPage();
 // //  	// 			alert('Invalid Username or Password');
 // //  	// 		}
 // 		}
	// });



}

function checkUser(){
	//check if user exists
	var userName = document.getElementById("username").value;
	var message = {username: userName,
				 password: document.getElementById("password").value};
		$.ajax({
 		url: '/',
 		datatype: "json",
 		type: "POST",
 		data: message,
 		success: function(response){
  			if(response.success){
  				//alert(response.username);
  				goToDashboard(userName);
  			}
  			else{
  				goToLoginPage();
  				alert('Invalid Username or Password');
  			}
 		}
	});
}

function checkDatabase(){
	var message = {username: document.getElementById("username").value,
				 password: document.getElementById("password").value,
				  email: document.getElementById("email").value};
		$.ajax({
 		url: '/register',
 		datatype: "json",
 		type: "POST",
 		data: message,
 		success: function(response){
  			if(response.success){
  				goToLoginPage();
  				alert('Account Successfully Created');
  			}
  			else{
  				goToCreatePage();
  				alert('Username Already Exists');
  			}
 		}
	}); 
}

function checkAccountValues(){
	username = $('.username').val();
	pw = $('.pw').val();
	pw2 = $('.pw2').val();
	if(username.length < 7){
		alert("Username needs to be 7 or more chars");
	}
	else if(pw != pw2){
		alert("Passwords need to match");
	}
	else if(pw .length < 7){
		alert("Password needs to be 7 or more chars");
	}
	else{
		//send post request to check user/add user
		checkDatabase();
	}
}

