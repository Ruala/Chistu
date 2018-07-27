<?php

if(isset($_POST['name']))
{
    $name = htmlspecialchars($_POST['name']);
    $name = urldecode($name);
}

if(isset($_POST['phone']))
{
    $phone = htmlspecialchars($_POST['phone']);
    $phone = urldecode($phone);
}
if(isset($_POST['email']))
{
    $email = htmlspecialchars($_POST['email']);
    $email = urldecode($email);
}
else $email = 'Не указан';
if(isset($_POST['message']))
{
    $message = htmlspecialchars($_POST['message']);
    $message = urldecode($message);
}
else $message = 'Нет';

if(isset($name) && isset($phone)) {
    if (mail("kawas888@yandex.ru", "Заказ с сайта", "Имя:".$name.". Телефон: ".$phone.". E-mail: ".$email.". Сообщение: ".$message ,"From: Chistu \r\n"))
    {
        echo "сообщение успешно отправлено";
    } else {
        echo "при отправке сообщения возникли ошибки";
    }
}

?>