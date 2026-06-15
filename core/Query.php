<?php
include_once(__DIR__ .'/../../../basis/credentials_basis.php');

class Database {

	protected $con;
	protected $connected = false;
	protected $messageCon;

	public function __construct() {
		$this->connect();
	}

	public function __destruct() {
		$this->con = null;
	}

	public function getConnected() {
		return $this->connected;
	}

	private function connect() {
		try {
			$this->con = new PDO('mysql:host=' .HOST. '; port=' .PORT. '; dbname=' .DATABASE, USER, PASS, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
			$this->connected = true;
			$this->messageCon = "Conexão realizada com sucesso!";
		} catch (PDOException $e) {
			$this->connected = false;
			$this->messageCon = "Falha na conexão com o banco de dados. Verifique se os parâmetros de acesso estão corretos e se o servidor está ativo.";			
		}
	}

	public function setConnect() {
		$this->connect();
	}
}

class Query extends Database {

	private $sql;
	private $active = false;
	private $message;
	private $arr_params = [];
	private $result;
	private $id_last = 0;
	private $json;

	public function __construct() {
		parent::__construct();
	}

	public function setSQL($textSQL) {
		$this->sql = $textSQL;
	}

	public function setArrParams($arr) {
		$this->arr_params = $arr;
	}

	public function getActive() {
		return $this->active;
	}

	public function getIdLast($mess="") {
		$json = ($mess) ?json_encode(["message" => $mess, "data" => $this->id_last], JSON_UNESCAPED_UNICODE) :$this->id_last;
		return $json;
	}

	public function getCountRow() {
		return ($this->active) ?count($this->result) :0;
	}

	public function getMessage() {
		if (!$this->connected) {
			return $this->messageCon;			
		} else {
			return $this->message;
		}
	}

	public function getResult() {
		return $this->result;
	}

	public function getJSON($mess=null, $arr=[]) {
		if (!$this->connected) {
			$json = json_encode(["message" => $this->messageCon, "data" => []], JSON_UNESCAPED_UNICODE);
		} else if (!$this->active) {
			$json = json_encode(["message" => $this->message, "data" => []], 
				JSON_UNESCAPED_UNICODE);
		} else if ($mess) {
			$json = json_encode(["message" => $mess, "data" => $arr], JSON_UNESCAPED_UNICODE);

		} else {
			$json = ($this->result) 
				?json_encode(["message" => $this->message, "data" => $this->result],
					JSON_UNESCAPED_UNICODE)
				:json_encode(["message" => "Nenhum registro encontrado.", "data" => $arr],
					JSON_UNESCAPED_UNICODE);
		}
		return $json;
	}

	public function getMyJSON($mess, $arr=[]) {
		$json = json_encode(["message" => $mess, "data" => $arr], JSON_UNESCAPED_UNICODE);
		return $json;
	}

	public function execSQL() {
		if ($this->connected) {

			$this->con->beginTransaction();
			try {
				$this->result = $this->con->prepare($this->sql);
				$this->result->execute($this->arr_params);

				$this->id_last = $this->con->lastInsertId();
				if ($this->con->inTransaction()) {
                    $this->con->commit();
				}
                
				$this->active = true;
				$this->result = $this->result->fetchAll(PDO::FETCH_ASSOC);
				$this->message = 'Script executado com sucesso!';

			} catch (PDOException $e) {
				$this->active = false;
				$this->message = 'Falha na execução do Script: ' .$this->sql .'. -- MENSAGEM ORIGINAL: ' .$e->getMessage();
 				if ($this->con->inTransaction()) {
				  $this->con->rollBack();
				}
			}						
		} else {
			$this->message = 'A conexão com o banco dados não está ativa';
		}
	}
    
	public function execAutoList($arr) {
		if ($this->connected) {

            foreach($arr as $sql) {
 				if (!$this->con->inTransaction()) {
                    $this->con->beginTransaction();
                }
                
				$this->result = $this->con->prepare($sql);
				$this->result->execute();            
            }
            
			try {
 				if ($this->con->inTransaction()) {
                    $this->con->commit();
				}            
				$this->active = true;
				$this->result = $this->result->fetchAll(PDO::FETCH_ASSOC);
				$this->message = 'Script executado com sucesso!';

			} catch (PDOException $e) {
				$this->active = false;
				$this->message = 'Falha na execução do Script: ' .$this->sql .'. -- MENSAGEM ORIGINAL: ' .$e->getMessage();
 				if ($this->con->inTransaction()) {
				  $this->con->rollBack();
				}
			}		
            
		} else {
			$this->message = 'A conexão com o banco dados não está ativa';
		}
	}    

    public static function encrypt($valor) { 
        return md5(strip_tags(filter_var(addslashes($valor), 
		FILTER_SANITIZE_STRING)));
    }

}

?>
