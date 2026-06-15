<?php
    include('Query.php');

    $act = $_POST['act'];
  	$query = new Query();

    if ($act == -1) { // para testar conexão
        $sql = 'select id, codigo, nome from alunos
            where serie=? and turma=?
            order by nome LIMIT 2';

        $query->setSQL($sql);
        $query->setArrParams([ $_POST['serie'], $_POST['turma'] ]);
        $query->execSQL();
        echo $query->getJSON();

/* ---------------------------------------------------------------------------------- */         

  	} else if ($act == 0) { // fazer login de aluno
        $login = $_POST['login'];
        $senha = $_POST['senha'];
        $sql = 'select id, nome, senha
            from aluno
            where excluido=0 and nome_login = ?';

        $query->setSQL($sql);
        $query->setArrParams([$login]);
        $query->execSQL();
        
        $fetch = $query->getResult();
        $mess = 'Você não está cadastrado. Clique em Ok se deseja efetuar seu cadastro agora.';

        if (!empty($fetch)) {
            $senha = $query->encrypt($senha);
            if ($fetch[0]['senha'] == $senha) {
                $mess = 'Login autenticado.';
            } else {
                $mess = 'Senha inválida. Caso esqueceu a senha, procure a direção para solucionar o problema.';
                $fetch = [0];
            }
        }       
        echo $query->getMyJSON($mess, $fetch);

    } else if ($act == 1) { // verificar o nome para login de aluno
        $login = $_POST['login'];
        $sql = 'select id, nome from aluno
            where excluido=0 and nome_login = ?';

        $query->setSQL($sql);
        $query->setArrParams([$login]);
        $query->execSQL();
        echo $query->getJSON();            

    } else if ($act == 2) { // salvar aluno
        $params = [
            $_POST['nome'],
            $_POST['nome_login'],
            $query->encrypt($_POST['senha']),
            $_POST['turno'],
            $_POST['serie'],
            $_POST['turma'],
        ];
  		$sql = 'insert into aluno(nome, nome_login, senha, turno, serie, turma)
                values(?,?,?,?,?,?)';

  		$query->setSQL($sql);
  		$query->setArrParams($params);
        $query->execSQL();
        if ($query->getActive()) {
            $mess = 'Cadastro realizado com sucesso. Efetue novamente o seu Login.';
            echo $query->getMyJSON($mess);
        } else {
            echo $query->getJSON();            
        }

    } else if ($act == 3) { // carregar alunos
        $sql = 'select id, codigo, nome from alunos
                where excluido=0 and ano_letivo=? and serie=? and turma=? order by nome';

        $query->setSQL($sql);
        $query->setArrParams([ date('Y'), $_POST['serie'], $_POST['turma'] ]);
        $query->execSQL();
        echo $query->getJSON();    

/* ---------------------------------------------------------------------------------- */         

    } else if ($act == 10) { // fazer login de doador
        $login = $_POST['login'];
        $senha = $_POST['senha'];
        $sql = 'select id, nome, senha from doador
            where excluido=0 and nome_login = ?';

        $query->setSQL($sql);
        $query->setArrParams([$login]);
        $query->execSQL();
        
        $fetch = $query->getResult();
        $mess = 'Você não está cadastrado. Clique em Ok se deseja efetuar seu cadastro agora.';

        if (!empty($fetch)) {
            $senha = $query->encrypt($senha);
            if ($fetch[0]['senha'] == $senha) {
                $mess = 'Login autenticado.';
            } else {
                $mess = 'Senha inválida. Caso esqueceu a senha, procure a direção para solucionar o problema.';
                $fetch = [0];
            }
        }        
        echo $query->getMyJSON($mess, $fetch);    
    
    } else if ($act == 11) { // verificar nome para login de doador
        $login = $_POST['login'];
        $sql = 'select id, nome from doador
            where excluido=0 and nome_login = ?';

        $query->setSQL($sql);
        $query->setArrParams([$login]);
        $query->execSQL();
        echo $query->getJSON();            
        
    } else if ($act == 12) { // salvar doador
        $params = [
            $_POST['nome'],
            $_POST['nome_login'],
            $query->encrypt($_POST['senha']),
            $_POST['profissao'],
            $_POST['contato'],
        ];
  		$sql = 'insert into doador(nome, nome_login, senha, profissao, contato)
                values(?,?,?,?,?)';

  		$query->setSQL($sql);
  		$query->setArrParams($params);
        $query->execSQL();
        if ($query->getActive()) {
            $mess = 'Cadastro realizado com sucesso. Efetue novamente o seu Login.';
            echo $query->getMyJSON($mess);
        } else {
            echo $query->getJSON();            
        }        

/* ---------------------------------------------------------------------------------- */         

    } else if ($act == 22) { // salvar livro
        $params = [
            $_POST['doador_id'],
            $_POST['titulo'],
            $_POST['materia'],
            $_POST['autor'],
            $_POST['sinopse'],
        ];
  		$sql = 'insert into livro(doador_id, titulo, materia, autor, sinopse, data_inclusao)
                values(?,?,?,?,?, CURDATE())';

  		$query->setSQL($sql);
  		$query->setArrParams($params);
        $query->execSQL();
        if ($query->getActive()) {
            $mess = 'Cadastro realizado com sucesso. Efetue novamente o seu Login.';
            echo $query->getMyJSON($mess);
        } else {
            echo $query->getJSON();            
        }
            
    } else if ($act == 23) { // carregar livros
        $val = [];
        $sql = 'select id, titulo, autor, materia, sinopse, status_livro, aluno_id from livro
            where excluido=0 and status_livro in (0,1,3) order by materia, titulo';

        if (isset($_POST['doador'])) {
            $val = [$_POST['doador']];
            $sql = 'select id, titulo, autor, materia, sinopse, status_livro from livro
                where excluido=0 and doador_id=? order by materia, titulo';
        }

        $query->setSQL($sql);
        $query->setArrParams($val);
        $query->execSQL();
        echo $query->getJSON();

    } else if ($act == 24) { // remover livro
        $id = $_POST['id'];
        $sql = 'update livro set excluido = 1 where id=?';
 
        $query->setSQL($sql);
        $query->setArrParams([ $id ]);
        $query->execSQL();
        echo $query->getJSON('ok', [0]);    

    } else if ($act == 25) { // solicitar/cancelar livro
        $acao = $_POST['acao'];
        $id = $_POST['id'];
        $aluno = $_POST['aluno'];
        $mess = 'Solicitação realizada com sucesso.';
        if ($acao == 0) { // solicitar
            $sql = 'update livro set status_livro = 1, aluno_id=? where id=?';
        } else { // cancelar
            $aluno = 0;
            $mess = 'Cancelamento de solicitação realizado com sucesso.';
            $sql = 'update livro set status_livro = 0, aluno_id=? where id=?';
        }
 
        $query->setSQL($sql);
        $query->setArrParams([ $aluno, $id ]);
        $query->execSQL();
        echo $query->getJSON($mess, [0]);
    
/* ---------------------------------------------------------------------------------- */         
        
    } else if ($act == 30) { // fazer login do diretor
        $login = $_POST['login'];
        $senha = $_POST['senha'];
        $sql = 'select id, nome, senha from doador
            where excluido=0 and diretor=1 and nome_login = ?';

        $query->setSQL($sql);
        $query->setArrParams([$login]);
        $query->execSQL();
        
        $fetch = $query->getResult();
        $mess = 'Você não está cadastrado. Favor entrar em contato com o suporte.';

        if (!empty($fetch)) {
            $senha = $query->encrypt($senha);
            if ($fetch[0]['senha'] == $senha) {
                $mess = 'Login autenticado.';
            } else {
                $mess = 'Senha inválida. Caso esqueceu a senha, favor entrar em contato com o suporte.';
                $fetch = [0];
            }
        }        
        echo $query->getMyJSON($mess, $fetch);    

    } else if ($act == 31) { // carregar livros no perfil do diretor
        $st = $_POST['status'];
        $sql = 'select a.id, a.titulo, a.autor, a.materia, a.sinopse, a.status_livro, a.aluno_id,
                b.nome AS doador_nome, COALESCE(b.contato, "Não informado") AS contato, 
                c.nome AS aluno_nome, 
                CASE c.turno
                WHEN 0 THEN CONCAT(c.serie, UPPER(c.turma), "-Manhã")
                WHEN 1 THEN CONCAT(c.serie, UPPER(c.turma), "-Tarde")
                WHEN 2 THEN CONCAT(c.serie, UPPER(c.turma), "-Noite")
                END AS classe
                FROM livro a
                INNER JOIN doador b ON (a.doador_id = b.id)
                LEFT JOIN aluno c ON (a.aluno_id = c.id)
                WHERE a.excluido=0 AND a.status_livro in (' .$st .')  
                ORDER BY a.materia, a.titulo';

        $query->setSQL($sql);
        $query->setArrParams([]);
        $query->execSQL();
        echo $query->getJSON();

    } else if ($act == 32) { // gerenciamento do diretor
        $id = $_POST['id'];
        $status = $_POST['status'];
        $sql = 'update livro set status_livro=? where id=?';
 
        $query->setSQL($sql);
        $query->setArrParams([ $status, $id ]);
        $query->execSQL();
        echo $query->getJSON();
    }

?>
