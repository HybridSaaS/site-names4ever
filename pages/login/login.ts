/// <reference path="../../definition/jquery.d.ts" />

$(function () {
	$("#submitLogin").on("click", () => {
	    $.ajax({
	            type: 'POST',
	            dataType: 'json',
	            cache: false,
	            url: '/website/system/login',
	            data: {
	                "username": $("#usernameLogin input").val(),
	                "password": $("#passwordLogin input").val()
	            }
	        })
	        .done(data => {

	            if (data.status == 'valid')
                    location.href = '/';
                else {
	                alert('Ongeldige inlognaam of wachtwoord!');
	            }
	        })
	        .fail(() => alert('Fout tijdens controleren'));
	});
});