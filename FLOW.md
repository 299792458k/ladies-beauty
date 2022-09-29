# Login
Login_POST -> set_cookie_refreshToken, firstLogin_true -> window.location.href.'/' ->
-> refresh_token_GET, user_infor_GET (GlobalState), khi req user_info thi truyen headers[Authorization] = token de Auth o backend 

Login success -> localStorage(firstLogin = true) -> refresh_token (dataProvider), dataProvider truyen token vao trong children