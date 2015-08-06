<?php

/**
 * Created by IntelliJ IDEA.
 * User: Alan
 * Date: 07/07/2015
 * Time: 17:32
 */
class connexionBD
{
    protected $db;

    public function __construct(){
        $this->connexion();
    }

    private function connexion(){
        $hostName = 'localhost';
        $dbName = 'zero_sec';
        $user = 'root';
        $password = '';
        try{
            $this->db = new PDO('mysql:host=' . $hostName . ';dbname=' . $dbName, $user, $password);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(Exception $e) {
            echo 'Exception reçue : ', $e->getMessage(), "\n";
        }
    }

    public function checkLogin($username, $password) {
        $q = $this->db->query('SELECT id, fonction FROM zs_utilisateur WHERE identifiant = "'.$username.'" AND mot_de_passe ="'.$password.'"');
        return $q->fetch(PDO::FETCH_ASSOC);
    }

    public function register($cp, $email, $password) {
        $q = $this->db->prepare('INSERT INTO zs_utilisateur(identifiant,mot_de_passe, email) VALUES (:cp, :password, :email)');
        $q->bindParam(':cp', $cp);
        $q->bindParam(':password', $password);
        $q->bindParam(':email', $email);
        $q->execute();

    }

    public function verifExistID($cp) {
        $q = $this->db->query('SELECT id FROM zs_utilisateur WHERE identifiant ="'.$cp.'"');
        $result = true;
        $message = "";
        if(!is_bool($q->fetch(PDO::FETCH_ASSOC))){
            $message = "Cet identifiant est déjà utilisé.";
            $result = false;
        }
        return array("result" => $result, "message" => $message);

    }

    public function verifExistMail($email) {
        $q = $this->db->query('SELECT id FROM zs_utilisateur WHERE email ="'.$email.'"');
        $result = true;
        $message = "";
        if(!is_bool($q->fetch(PDO::FETCH_ASSOC))){
            $message = "Cette adresse mail est déjà utilisée.";
            $result = false;
        }
        return array("result" => $result, "message" => $message);
    }

    public function verifExistIDAndMail($cp, $email) {
        $rep = $this->verifExistMail($email);
        if($rep["result"]) {
            $rep = $this->verifExistID($cp);
        }
        return $rep;
    }

    public function insertRetard($id_agent, $bool_retard, $num_train, $motif_retard, $description_retard) {
        $q = $this->db->prepare('INSERT INTO zs_historique(id_OD, retard, num_train, motif_retard, description_retard) VALUES (:id_agent, :bool_retard, :num_train, :motif_retard, :description_retard)');
        $q->bindParam(':id_agent', $id_agent);
        $q->bindParam(':bool_retard', $bool_retard);
        $q->bindParam(':num_train', $num_train);
        $q->bindParam(':motif_retard', $motif_retard);
        $q->bindParam(':description_retard', $description_retard);
        $q->execute();
    }
}