import * as fn from './functions.js'

class Events {
    constructor(config, api) {
        this.config = config
        this.dataJSON = ''
        this.apiDefault = api
        this.success = false
    }

    async loadContent(url) {
        let  content = fn.getControl(this.config.container)
        await fn.request(url).then((res) => {
            content.innerHTML = res
            if (document.querySelector('.infoco')) {
                document.querySelector('.infoco').focus()
            }
        }).catch((err) => {
            fn.processError(url, err, 'Não foi possível carregar a página')
        })
    }    

    async loadJSON(params) {
        await fn.request(this.apiDefault, params, true).then((res) => {
            this.dataJSON = res
        }).catch((err) => {
            fn.processError('ev.loadJSON', err, 'Não foi possível carregar a página')
        })
    }

    async loadAcervo(url, params, source) {
        let content = fn.getControl(this.config.container)
        await fn.request(url).then((res) => {
            content.innerHTML = res
            if (document.querySelector('.infoco')) {
                document.querySelector('.infoco').focus()
            }
            let controle = fn.getControl(params[0])
            controle.innerHTML = params[1]
            this.loadLivros(source)
        }).catch((err) => {
            fn.processError(url, err, 'Não foi possível carregar a página')
        })
    }    

    async loadLivros(source=0) {
        let params
        let classeBotoesAluno = 'not-visible'
        let classeBotoesDoador = 'not-visible'
        if (source==0) { // para alunos
            params = ['act=23', 'status_livro=0']
        } else {
            params = ['act=23', 'doador=' +this.config.logado.id] // para doadores
        }

        await fn.request(this.apiDefault, params, true).then((res) => {
            let cards = ''
            let status = ''
            let classeBotoes = ''
            let disableSolicitacao = ''
            let disableCancelamento = ''
            res.data.forEach(livro => {
                status = 'disponível'
                classeBotoes = 'div-card-botoes'
                disableSolicitacao = ''
                disableCancelamento = ''
                if (livro.status_livro == 1) {
                    status = 'solicitado'
                    disableSolicitacao = 'disabled'
                    if (livro.aluno_id != this.config.logado.id) {
                        disableCancelamento = 'disabled'                        
                    } else {
                        status = 'Solicitado por você'
                    }

                } else if (livro.status_livro == 2) {
                    status = 'doado'
                    classeBotoes = 'div-card-botoes not-visible'
                } else if (livro.status_livro == 3) {
                    status = 'na direção para entrega'
                    classeBotoes = 'div-card-botoes not-visible'
                }

                if (source==0) {  // área do aluno
                    classeBotoesAluno = classeBotoes
                } else { // área do doador
                    classeBotoesDoador = classeBotoes
                }
                
                cards += `                
                    <div id="card-${livro.id}" class="col acervo-${status}">
                        <div class="card" id="card-${livro.id}">
                            <div class="card-body">
                                <h6 class="status-doado ${status}">${status}</h6>
                                <h5 class="card-title">${livro.titulo}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${this.config.materias[livro.materia]}</h6>
                                <h6 class="card-subtitle mb-2">Autor: ${livro.autor}</h6>
                                <div class="div-sinopse">
                                    <p class="card-text">${livro.sinopse}</p>
                                </div>
                                <div class="${classeBotoesAluno}">
                                    <button id="botao-solicitar-livro" ${disableSolicitacao} name="livro-${livro.id}" class="btn btn-link">Fazer solicitação</button>
                                    <button id="botao-cancelar-livro" ${disableCancelamento} name="cancelar-${livro.id}" class="btn btn-link">Cancelar solicitação</button>
                                </div>

                                <div class="${classeBotoesDoador}">
                                    <button id="botao-doar-livro" name="livro-${livro.id}" class="btn btn-link">Fazer doação</button>
                                    <button id="botao-remover-livro" name="remover-${livro.id}" class="btn btn-link">Remover</button>                                    
                                </div>

                            </div>
                        </div>
                    </div>`
            })
            let container = fn.getControl(this.config.container_acervo)
            container.innerHTML = cards
        }).catch((err) => {
            fn.processError('ev.loadLivros', err, 'Não foi possível carregar a página')
        })
    }

     async loadDiretor(url, params) {
        let content = fn.getControl(this.config.container)
        await fn.request(url).then((res) => {
            content.innerHTML = res
            let controle = fn.getControl(params[0])
            controle.innerHTML = params[1]
        }).catch((err) => {
            fn.processError(url, err, 'Não foi possível carregar a página do diretor.')
        })
    }  

    async loadLivrosDiretor(titulo, st) {
        let descricao = ['','Direcionamentos (recebimentos e entregas)','Acervo e movimentações']
        let visible = (titulo==2) ? 'not-visible' :'';
        let params
        params = ['act=31', 'status=' +st]
        await fn.request(this.apiDefault, params, true).then((res) => {            
            let cards = `<p class="text-muted mb-0">${descricao[titulo]}</p>`
            let status = ''
            res.data.forEach(livro => {
                status = 'disponível'                
                if (livro.status_livro == 1) {
                    status = 'solicitado'
                } else if (livro.status_livro == 2) {
                    status = 'doado'
                } else if (livro.status_livro == 3) {
                    status = 'na direção para entrega'
                }
                
                cards += `                
                    <div id="card-${livro.id}" class="col acervo-${status}">
                        <div class="card" id="card-${livro.id}">
                            <div class="card-body">
                                <h6 id="status-${livro.id}" class="status-doado ${status}">${status}</h6>
                                <h5 class="card-title">${livro.titulo}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${this.config.materias[livro.materia]}</h6>
                                <h6 class="card-subtitle mb-2">Autor: ${livro.autor}</h6>
                                <hr>
                                <p>Doador: ${livro.doador_nome} - Contato: ${livro.contato}</p>
                                <hr>
                                <h6 class="p-solicitante">Aluno(a): ${livro.aluno_nome} - Classe: ${livro.classe}</h6>
                                <hr>
                                <div>
                                    <button id="botao-receber-diretor" name="receber-${livro.id}" class="btn btn-link ${visible}">Receber do doador</button>
                                    <button id="botao-entregar-diretor" name="entregar-${livro.id}" class="btn btn-link ${visible}">Entregar ao aluno</button>                                    
                                </div>

                            </div>
                        </div>
                    </div>`
            })
            let container = fn.getControl(this.config.container_acervo)
            container.innerHTML = cards
        }).catch((err) => {
            fn.processError('ev.loadLivros', err, 'Não foi possível carregar a página de livros para o diretor.')
        })
    }

    async admDiretor(st, id) {
        await fn.request(this.apiDefault, ['act=32', 'status=' +st, 'id=' +id], false).then((res) => {
            let stat = fn.getControl('#status-' +id)
            stat.innerHTML = (st==2) ?'Doação concluída' :"na direção para entrega";
            
        }).catch((err) => {
            fn.processError('ev.removerLivro', err, 'Não foi possível atualizar o manejo do livro')
        })
    }

    async solicitarLivro(id, acao=0) {
        await fn.request(this.apiDefault, ['act=25', 'acao=' +acao, 'id=' +id, 'aluno=' +this.config.logado.id], true).then((res) => {
            if (res.data[0] == 0) {
                alert(res.message)
                this.loadLivros()
            }
        }).catch((err) => {
            fn.processError('ev.removerLivro', err, 'Não foi possível remover o livro')
        })
    }

    async removerLivro(id) {
        await fn.request(this.apiDefault, ['act=24','id=' +id], true).then((res) => {
            if (res.message == 'ok') {
                fn.getControl('#card-' +id).classList.add('not-visible')
            }
        }).catch((err) => {
            fn.processError('ev.removerLivro', err, 'Não foi possível remover o livro')
        })
    }

    async salvarAluno() {
        this.sucess = false
        let doit = false        
        let params = [
            'act=1',
            'login=' +document.querySelector('#text-aluno-login').value,
        ];

        try {
            await fn.request(this.apiDefault, params, true).then((res) => {
                if (res.data.length==0) {
                    doit = true
                } else {
                    alert('Esse nome de Login já foi cadastrado, favor definir outro nome.')
                }
            })

            if (doit) {
                params = [
                    'act=2',
                    'nome=' +document.querySelector('#text-aluno-nome').value,
                    'nome_login=' +document.querySelector('#text-aluno-login').value,
                    'senha=' +document.querySelector('#text-aluno-senha').value,
                    'turno=' +document.querySelector('#select-turno').value,
                    'serie=' +document.querySelector('#text-aluno-serie').value,
                    'turma=' +document.querySelector('#text-aluno-turma').value
                ];

                await fn.request(this.apiDefault, params, true).then((res) => {
                    this.success = true
                    alert(res.message)
                })
            }

        } catch(err) {
            fn.processError('ev.salvarAluno', err, 'Não foi possível salvar o cadastro de aluno')
        }
    }

    async salvarDoador() {
        this.sucess = false
        let doit = false        
        let params = [
            'act=11',
            'login=' +document.querySelector('#text-doador-login').value,
        ];

        try {
            await fn.request(this.apiDefault, params, true).then((res) => {
                if (res.data.length==0) {
                    doit = true
                } else {
                    alert('Esse nome de Login já foi cadastrado, favor definir outro nome.')
                }
            })

            if (doit) {
                params = [
                    'act=12',
                    'nome=' +document.querySelector('#text-doador-nome').value,
                    'nome_login=' +document.querySelector('#text-doador-login').value,
                    'senha=' +document.querySelector('#text-doador-senha').value,
                    'profissao=' +document.querySelector('#text-doador-profissao').value,
                    'contato=' +document.querySelector('#text-doador-contato').value,
                ];

                await fn.request(this.apiDefault, params, true).then((res) => {
                    this.success = true
                    alert(res.message)
                })
            }

        } catch(err) {
            fn.processError('ev.salvarDoador', err, 'Não foi possível salvar o cadastro do doador')
        }
    }

    async salvarLivro() {
        this.sucess = false
        let params = [
            'act=22',
            'doador_id=' +this.config.logado.id,
            'titulo=' +document.querySelector('#text-livro-titulo').value,
            'materia=' +document.querySelector('#select-livro-materia').value,
            'autor=' +document.querySelector('#text-livro-autor').value,
            'sinopse=' +document.querySelector('#text-livro-sinopse').value,
        ];

        await fn.request(this.apiDefault, params, true).then((res) => {
            this.success = true
        }).catch((err) => {
            fn.processError('ev.salvarLivro', err, 'Não foi possível salvar o cadastro do livro')
        })
    }

}

export { Events }
