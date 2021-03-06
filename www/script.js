var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
	$scope.info_url='http://lokabina.com/';
	//$scope.info_url='http://localhost/lokamed/';
	$scope.page_back=1;
	$scope.page_number=1;
	$scope.display_player='none';

	if(localStorage.getItem('login_code')==null) {
		localStorage.setItem('username', '');
		localStorage.setItem('login_code', '');
	}
	$scope.username=localStorage.getItem('username');
	$scope.login_code=localStorage.getItem('login_code');

	if(localStorage.getItem("categories")!=null) {
		$scope.categories=JSON.parse(localStorage.getItem("categories"));
	} else {
		$scope.categories=[{'category':'لطفا صبر کنید ...'}];
	}
	$http.get($scope.info_url+'json_categories.php')
		.then(function(response) {
			$scope.categories = response.data;
			localStorage.setItem("categories", JSON.stringify($scope.categories));
		});

	$scope.select_category=function (cat) {
		$scope.category_selected=cat;
		if(localStorage.getItem("sounds"+cat)!=null) {
			$scope.sounds=JSON.parse(localStorage.getItem("sounds"+cat));
		} else {
			$scope.sounds=[{'name':'لطفا صبر کنید ...'}];
		}
		$http.get($scope.info_url+'json_sounds.php?category='+cat)
			.then(function(response) {
				$scope.sounds = response.data;
				localStorage.setItem("sounds"+cat, JSON.stringify($scope.sounds));
			});
	}

	$scope.select_mysounds=function () {
		$scope.category_selected=0;
		if(localStorage.getItem("sounds"+$scope.category_selected)!=null) {
			$scope.sounds=JSON.parse(localStorage.getItem("sounds"+$scope.category_selected));
		} else {
			$scope.sounds=[{'name':'لطفا صبر کنید ...'}];
		}
		$http.get($scope.info_url+'json_mysounds.php?username='+$scope.username+'&login_code='+$scope.login_code)
			.then(function(response) {
				$scope.sounds = response.data;
				localStorage.setItem("sounds"+$scope.category_selected, JSON.stringify($scope.sounds));
			});
	}

	$scope.select_sound=function (sound) {
		$scope.display_player='none';
		$scope.sound_selected=sound;
		if(localStorage.getItem("soundaccess"+sound)!=null) {
			$scope.soundaccess=JSON.parse(localStorage.getItem("soundaccess"+sound));
		} else {
			$scope.soundaccess=[];
		}
		$http.get($scope.info_url+'json_soundaccess.php?username='+$scope.username+'&login_code='+$scope.login_code+'&id='+sound)
			.then(function(response) {
				$scope.soundaccess = response.data;
				localStorage.setItem("soundaccess"+sound, JSON.stringify($scope.soundaccess));
				if($scope.soundaccess[$scope.sound_selected]['access']==true) {
					$scope.display_player='block';
				} else {
					$scope.display_player='none';
				}
			});
	}

	$scope.check_login=function () {
		if(localStorage.getItem("login_data")!=null) {
			$scope.login_data=JSON.parse(localStorage.getItem("login_data"));
		} else {
			$scope.login_data=[];
		}
		$http.get($scope.info_url+'json_checklogin.php?username='+$scope.username+'&login_code='+$scope.login_code)
			.then(function(response) {
				$scope.login_data = response.data;
				localStorage.setItem("login_data", JSON.stringify($scope.login_data));
			});
	}
	$scope.check_login();

	$scope.insert_logout=function () {
		$scope.login_data=[];
		localStorage.setItem('username', null);
		localStorage.setItem('login_code', null);
		localStorage.setItem('login_data', null);
		$scope.username=null;
		$scope.login_code=null;
		$scope.check_login();
	}

	$scope.check_password=function (username,password) {
		$scope.password_data=[];
		$http.get($scope.info_url+'json_checkpassword.php?username='+username+'&password='+password)
			.then(function(response) {
				$scope.password_data = response.data;
				localStorage.setItem('username', $scope.password_data['username']);
				localStorage.setItem('login_code', $scope.password_data['login_code']);
				$scope.username=$scope.password_data['username'];
				$scope.login_code=$scope.password_data['login_code'];
				$scope.check_login();
			});
	}

	$scope.purchase=function (sound) {
		$scope.purchase_data=[];
		$http.get($scope.info_url+'json_purchases.php?username='+$scope.username+'&login_code='+$scope.login_code+'&id='+sound)
			.then(function(response) {
				$scope.purchase_data = response.data;
				$scope.select_sound(sound);
				$scope.check_login();
			});
	}

	$scope.insert_user=function (username,password,repassword,firstname,lastname,email,phone) {
		$scope.signup_data=[];
		$http.get($scope.info_url+'json_signup.php?username='+username+'&password='+password+'&repassword='+repassword+'&firstname='+firstname+'&lastname='+lastname+'&gender=1&email='+email+'&phone='+phone)
			.then(function(response) {
				$scope.signup_data = response.data;
				$scope.check_password(username,password);
			});
	}

	$scope.insert_bazaar=function (orderid,purchasetoken,purchasetime,productid,signature) {
		$scope.bazaar_data=[];
		$http.get($scope.info_url+'json_bazaar.php?username='+$scope.username+'&login_code='+$scope.login_code+'&orderid='+orderid+'&purchasetoken='+purchasetoken+'&purchasetime='+purchasetime+'&productid='+productid+'&signature='+signature)
			.then(function(response) {
				$scope.bazaar_data = response.data;
				$scope.check_login();
			});
	}

	$scope.gotopage=function (page_number) {
		$scope.page_number=page_number;
		if(page_number==3) {
			$scope.page_back=2;
		} else {
			$scope.page_back=1;
		}
		if((page_number==1)||((page_number==2)&&($scope.category_selected!=0))||((page_number==3)&&($scope.sound_selected!=0))||(page_number==4)||(page_number==5)||(page_number==6)||(page_number==7)||(page_number==8)) {
			for (i = 1; i <= 8; i++) {
				if (i === page_number) {
					document.getElementById('page' + i).style.display = 'block';
				} else {
					document.getElementById('page' + i).style.display = 'none';
				}
			}
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		}
	}

	$scope.init = function(){
		$scope.show_error_bazaar=null;
		$scope.products_list=[{'title':'افزایش اعتبار 1000 تومان','productId':'1000'},{'title':'افزایش اعتبار 2000 تومان','productId':'2000'},{'title':'افزایش اعتبار 3000 تومان','productId':'3000'},{'title':'افزایش اعتبار 4000 تومان','productId':'4000'},{'title':'افزایش اعتبار 5000 تومان','productId':'5000'},{'title':'افزایش اعتبار 6000 تومان','productId':'6000'},{'title':'افزایش اعتبار 7000 تومان','productId':'7000'},{'title':'افزایش اعتبار 8000 تومان','productId':'8000'},{'title':'افزایش اعتبار 9000 تومان','productId':'9000'},{'title':'افزایش اعتبار 10000 تومان','productId':'10000'}];
		inappbilling.init($scope.success_init, $scope.error_bazaar, {showLog:true}, "com.farsitel.bazaar", "ir.cafebazaar.pardakht.InAppBillingService.BIND", "MIHNMA0GCSqGSIb3DQEBAQUAA4G7ADCBtwKBrwDDdeercq92ZqpP5EL83uFMs2I4bMogkmP2i1SITyyAcZpUEiMB/2YBBDkHbkspGQakuSEKkJghCdckWk+zmGaEv7NtryxI2mZZjXt4Sndoam/7D5Q6TUJrwbmc9lYL0n7vBRw7LmBN/3TQbk9jQiZwFfUqZb48J3sY7mJENJea8RI33ss8ng6cnqlj86Z7OZox/NplCwzgfyRbxBmRA8NYgFKGZ/XEibcbFYMDJ20CAwEAAQ==");
	}

	$scope.products = function(){
		inappbilling.getAvailableProducts($scope.success_products, $scope.error_bazaar);
	}

	$scope.buy = function(product){
		inappbilling.buy($scope.success_buy, $scope.error_bazaar, product);
	}

	$scope.consume = function(product){
		inappbilling.consumePurchase($scope.success_consume, $scope.error_bazaar_em, product);
	}

	$scope.error_bazaar = function(error) {
		$scope.show_error_bazaar=error;
	}

	$scope.error_bazaar_em = function(error) {
	}

	$scope.success_init = function(result) {
		$scope.show_error_bazaar=null;
		$scope.consume(0);
		$scope.consume(1000);
		$scope.consume(2000);
		$scope.consume(3000);
		$scope.consume(4000);
		$scope.consume(5000);
		$scope.consume(6000);
		$scope.consume(7000);
		$scope.consume(8000);
		$scope.consume(9000);
		$scope.consume(10000);
		$scope.products();
		$scope.show_error_bazaar=error;
	}

	$scope.success_products = function(result) {
		$scope.show_error_bazaar=null;
		$scope.products_list=result;
	}

	$scope.success_buy = function(result) {
		$scope.show_error_bazaar=null;
		$scope.buy_result=result;
		$scope.consume($scope.buy_result['productId']);
		$scope.insert_bazaar($scope.buy_result['orderId'],$scope.buy_result['purchaseToken'],$scope.buy_result['purchaseTime'],$scope.buy_result['productId'],$scope.buy_result['signature']);
	}

	$scope.success_consume = function(result) {
		$scope.show_error_bazaar=null;
		$scope.consume_result=result;
	}
});