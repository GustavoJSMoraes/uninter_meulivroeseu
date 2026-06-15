CREATE TABLE `aluno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(60) NOT NULL,
  `nome_login` varchar(30) NOT NULL,
  `senha` varchar(50) DEFAULT NULL,
  `serie` tinyint(4) DEFAULT NULL,
  `turma` varchar(10) DEFAULT NULL,
  `turno` tinyint(4) DEFAULT NULL,
  `excluido` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
)
CREATE TABLE `doador` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(60) NOT NULL,
  `nome_login` varchar(30) NOT NULL,
  `senha` varchar(50) DEFAULT NULL,
  `contato` varchar(50) DEFAULT NULL,
  `diretor` tinyint(4) NOT NULL DEFAULT '0',
  `excluido` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
)

CREATE TABLE `livro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doador_id` int(11), /* pode estar vazio = 0 */
  `aluno_id` int(11), /* pode estar vazio = 0 */
  `titulo` varchar(60) NOT NULL,
  `materia` varchar(30) not null,
  `autor` varchar(50),
  `sinopse` varchar(500),
  `status_livro` tinyint not null default 0, /* 0- disponível, 1- solicitado, 2- doado, 3- com a direção, 4- em pedido, 5- atendido */
  `data_inclusao` date,
  `data_doacao` date,
  `excluido` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
)
