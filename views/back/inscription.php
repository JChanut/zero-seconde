<?php
/**
 * Created by IntelliJ IDEA.
 * User: Alan
 * Date: 08/07/2015
 * Time: 12:55
 */
require_once("BD.php");

$con = new connexionBD();
$cp = $_POST['cp'];
$email = $_POST['email'];
$password = $_POST['password'];

$result = $con->verifExistIDAndMail($cp, $email);
$resultat = $result["result"];

if ($resultat) {
    $con->register($cp, $email, $password);
    echo json_encode(array("resultat" => $resultat, "erreur" => "Une erreur s'est produite..." ));
} else {
    echo json_encode(array("resultat" => $resultat, "erreur" => utf8_encode($result["message"])));
}

