<?php
	$id = $_POST["id"];
	$usuario = $_POST["usuario"];
	$nome = $_POST["nome"];
    $email = $_POST["email"];
    $telefone = $_POST["telefone"];
    $erro = false;
    $msg = "";
    	
	$con = mysqli_connect("localhost","inton634_tagarel","tagarela","inton634_tagarela","3306");
	if (!$con) {
		$erro = true;
		$msg = "Erro ao consistir a tabela de informações pessoais!";
	}
	else {
		$query1 = "UPDATE info SET nome = '$nome', email = '$email', telefone = '$telefone' "
				 ."WHERE usuario = '$usuario'";
		mysqli_query($con,$query1);	
	}
	mysqli_close($con);

    $ret = array();
    $ret["erro"] = $erro;
    $ret["msg"] = $msg;
    $ret["id"] = $id;
        
    echo json_encode($ret);
?>
