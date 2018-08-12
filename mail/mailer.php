<?php

$content = '';
/* Ловим УТМ метки */
if (isset($_COOKIE['utmCampaign'])) {
    $content .= '<br><br><p>UTM</p>
        utmCampaign:'.$_COOKIE['utmCampaign'].'<br>
        utmSource:'.$_COOKIE['utmSource'].'<br>
        utmMedium:'.$_COOKIE['utmMedium'].'<br>
        utmTerm:'.$_COOKIE['utmTerm'].'<br>
        utmContent:'.$_COOKIE['utmContent'].'<br><br>
        pmSource:'.$_COOKIE['pmSource'].'<br>
        pmBlock:'.$_COOKIE['pmBlock'].'<br>
        pmPosition:'.$_COOKIE['pmPosition'].'<br>
    ';
}

/* Ловим Регион */
if (isset($_COOKIE['y_region'])) {
    $content .= '<br><br><p>Region</p>
        Страна:'.$_COOKIE['y_country'].'<br>
        Регион:'.$_COOKIE['y_region'].'<br>
        Город:'.$_COOKIE['y_city'].'<br>
    ';
}

/*IP*/
$content .= '<br><br><p>IP: '.$_SERVER['REMOTE_ADDR'].'</p>';

/*
* Денис Герасимов http://rek9.ru/
* Данный скрипт обрабатывает форм и отправляет ее на email
* В письме вы увидите utm метки, если использовали их в рекламной кампании
* Измените в данном скрипте:
* 1. Тему письма (13 строчку)
* 2. Введите ваш email, на который отправлять обработанную форму (36 строчка)
* 3. Email, с которого отправлять письмо (39 строчка)
* 4. Имя, с которого отправляется письмо (40 строчка)
* 5. URL, на который будет переадресация, при успешной отправке формы (45 строчка)
*/
    $subject = 'Почта пришла!!!';                      // тема письма , вместо многоточия вставьте ваш домен
    $content .= '<hr>';

    if(isset($_POST['name'])) {
        $name = substr(htmlspecialchars(trim($_POST['name'])), 0, 100);
        $content .= '<b>Имя: </b>' . $name . '<br>';
    }
    if(isset($_POST['phone'])) {
        $phone = substr(htmlspecialchars(trim($_POST['phone'])), 0, 100);
        $content .= '<b>Телефон: </b>' . $phone . '<br>';
    }
    if(isset($_POST['email'])) {
        $mail = substr(htmlspecialchars(trim($_POST['email'])), 0, 100);
        $content .= '<b>Почта: </b>' . $mail . '<br>';
    }
    if(isset($_POST['message'])) {
        $message = substr(htmlspecialchars(trim($_POST['message'])), 0, 100);
        $content .= '<b>Сообщение: </b>' . $message . '<br>';
    }

	$content .= '<b>Заявка пришла со страницы:</b> ' . $_SERVER["HTTP_REFERER"] .'<br>'; // строчка, в которой передается UTM метки если есть
    $content .= '<hr>';
    // подключаем файл класса для отправки почты
    require 'class.phpmailer.php';

    $mail = new PHPMailer();
    $mail->AddAddress('333333y@gmail.com');      	// kawas888@yandex.ru                // кому - адрес, Имя (например, 'email@ rek9.ru','Денис Герасимов')
    $mail->IsHTML(true);                        				// выставляем формат письма HTML 
    $mail->CharSet = "UTF-8";                   				// кодировка
	$mail->From = "info@chistu.ru";					        	// email, с которого отправиться письмо
	$mail->FromName = "Chistu";					    // откого письмо
    $mail->Body = $content;
    $mail->Subject = $subject;

    // отправляем наше письмо		
	
	if ($mail->Send()) header('Location: ../');                 // в поле Location можно настроить переадресацию
	else { die ('Mailer Error: ' . $mail->ErrorInfo); }
?>