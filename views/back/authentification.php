<?php

/**
 * Created by IntelliJ IDEA.
 * User: Alan
 * Date: 07/07/2015
 * Time: 17:37
 */

require_once("BD.php");

function auth($username, $password) {
        $con = new connexionBD();
        return $con->checkLogin($username, $password);
}

$username = $_POST['username'];
$password = $_POST['password'];
$connec = auth($username,$password);
$donnee = false;
if ($connec == false ) {
    $donnee = array("connexion" => false);
} else {
    $donnee = array("connexion" => true, "id" => $connec["id"], "fonction" => $connec["fonction"]);
    $_SESSION['id_OD'] = $connec["id"];
}

echo json_encode($donnee);