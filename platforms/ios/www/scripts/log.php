<?php
	// IN
	$idBuilder = $_POST["idBuilder"];
	$espTut = $_POST["espTut"];
	// OUT
    $erro = false;
    $msg = "";
    $datas = array();
    $atvs = array();
    // Variaveis
    $i = 0;
    $id = 0;
    
	$con = mysqli_connect("localhost","inton634_tagarel","tagarela","inton634_tagarela","3306");
	if (!$con) {
		$erro = true;
		$msg = "Não foi possível conectar no banco de dados! Erro: " . mysqli_connect_error();
	}
	else {
		$query = "SELECT id FROM builder "
				."WHERE esp_tut = '$espTut' AND paciente = '$idBuilder'";
		$res = mysqli_query($con,$query);
		if (mysqli_num_rows($res) > 0) {
			while ($row = mysqli_fetch_assoc($res)) {
				$id = $row["id"];
					
				$query2 = "SELECT data_hora, atividade FROM log "
						 ."WHERE builder = '$id'";
				$res2 = mysqli_query($con,$query2);
				if (mysqli_num_rows($res2) > 0) {
					while ($row2 = mysqli_fetch_assoc($res2)) {
						$datas[$i] = $row2["data_hora"];
						$atvs[$i] = $row2["atividade"];
						$i = $i + 1;
					}
				}
			}
		}
	}
	mysqli_close($con);

    $ret = array();
    $ret["erro"] = $erro;
    $ret["msg"] = $msg;
    $ret["datas"] = $datas;
    $ret["atvs"] = $atvs;
    
    sleep(1);
    echo json_encode($ret);
?>