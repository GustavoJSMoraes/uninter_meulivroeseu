import * as config from '../../core/config.js'
import * as fn from './functions.js'
import { Events } from './Events.js'

const ev = new Events(config, 'core/api_query.php')

window.addEventListener('load', () => {
    ev.loadContent(config.route + 'home.html')
})

document.addEventListener('click', (event) => {
    if (event.target.id == 'direcao') {
        event.preventDefault()
        ev.loadContent(config.route + 'diretor.html')

    } else if (event.target.id == 'botao-doador') {
        ev.loadContent(config.route + 'doador.html')
    } else if (event.target.id == 'botao-aluno') {
        ev.loadContent(config.route + 'aluno.html')    

    } else if (event.target.id == 'botao-logar-aluno') {
        let usu = fn.getControl('#text-aluno-login').value
        let sen = fn.getControl('#text-aluno-senha').value
        if (usu && sen) {
            let params = [
                'act=0', 'login=' +usu, 'senha=' +sen
            ]
            page(0, params)
        } else {
            alert('Preencha todos os campos para efetuar o login.')
        }

    } else if (event.target.id == 'botao-logar-doador') {
        let usu = fn.getControl('#text-doador-login').value
        let sen = fn.getControl('#text-doador-senha').value
        if (usu && sen) {
            let params = [
                'act=10', 'login=' +usu, 'senha=' +sen
            ]
            page(1, params)
        } else {
            alert('Preencha todos os campos para efetuar o login.')
        }
        
    } else if (event.target.id == 'botao-logar-diretor') {
        let usu = fn.getControl('#text-diretor-login').value
        let sen = fn.getControl('#text-diretor-senha').value
        if (usu && sen) {
            let params = [
                'act=30', 'login=' +usu, 'senha=' +sen
            ]
            page(3, params)
        } else {
            alert('Preencha todos os campos para efetuar o login.')
        }

    } else if (event.target.id == 'botao-direcionamentos-diretor') {
        ev.loadLivrosDiretor(1, '1,3')

    } else if (event.target.id == 'botao-acervo-diretor') {
        ev.loadLivrosDiretor(2, '0,1,2,3')

    } else if (event.target.id == 'botao-receber-diretor') {
        let id = event.target.name.split('-')[1]
        ev.admDiretor(3, id)

    } else if (event.target.id == 'botao-entregar-diretor') {        
        let id = event.target.name.split('-')[1]
        ev.admDiretor(2, id)

    } else if (event.target.id == 'botao-aluno-salvar') {
        cadastrar() 

    } else if (event.target.id == 'botao-doador-salvar') {
        cadastrar(1) 

    } else if (event.target.id == 'botao-livro-salvar') {
        cadastrar(2) 

    } else if (event.target.id == 'botao-livro-voltar') {
        page(1)

    } else if (event.target.id == 'botao-titulo-novo') {
        ev.loadContent(config.route + 'cadastro_livro.html')


    } else if (event.target.id == 'checks-disponiveis') {
        let ch = fn.getControl('#' +event.target.id)
        let elements = document.querySelectorAll('.acervo-doado')
        elements.forEach(el => {
            if (ch.checked) {
                el.classList.add('not-visible')
            } else {
                el.classList.remove('not-visible')
            }
        });

    } else if (event.target.id == 'botao-remover-livro') {
        if (confirm('Clique em OK para confirmar a remoção do título selecionado.')) {
            let id = event.target.name.split('-')[1]
            ev.removerLivro(id)
        }

    } else if (event.target.id == 'botao-solicitar-livro') {
        let id = event.target.name.split('-')[1]
        ev.solicitarLivro(id)

    } else if (event.target.id == 'botao-cancelar-livro') {
        let id = event.target.name.split('-')[1]
        ev.solicitarLivro(id, 1)
    }
})

async function page(index, params=[]) {
    if (index == 2) {
        await ev.loadContent(config.route + 'acervo_doador').then(() => {
            
        })

    } else {
        await ev.loadJSON(params).then(() => {
            let fetch = ev.dataJSON
            
            if (index==0) {
                if (fetch.data.length == 0) {
                    if (confirm(fetch.message)) {
                        ev.loadContent(config.route + 'cadastro_aluno.html')
                    }
                } else if (fetch.data[0] == 0) {
                    alert(fetch.message)
                } else {
                    config.logado.id = fetch.data[0].id,
                    config.logado.nome = fetch.data[0].nome
                    config.logado.primeiro_nome = fetch.data[0].nome.split(' ').shift()
                    params = ['#div-aluno-logado span', 'Olá, aluno(a) ' +config.logado.primeiro_nome]
                    ev.loadAcervo(config.route + 'acervo_aluno.html', params, 0)
                }

            } else if (index==1) {
                if (fetch.data.length == 0) {
                    if (confirm(fetch.message)) {
                        ev.loadContent(config.route + 'cadastro_doador.html')
                    }
                } else if (fetch.data[0] == 0) {
                    alert(fetch.message)
                } else {
                    config.logado.id = fetch.data[0].id,
                    config.logado.nome = fetch.data[0].nome
                    config.logado.primeiro_nome = fetch.data[0].nome.split(' ').shift()
                    params = ['#div-doador-logado span', 'Olá, doador(a) ' +config.logado.primeiro_nome]
                    ev.loadAcervo(config.route + 'acervo_doador.html', params, 1)
                }

            } else if (index==3) {
                if (fetch.data.length > 0) {
                    if (fetch.data[0] == 0) {
                        alert(fetch.message)
                    } else {
                        config.logado.id = fetch.data[0].id,
                        config.logado.nome = fetch.data[0].nome
                        config.logado.primeiro_nome = fetch.data[0].nome.split(' ').shift()
                        params = ['#div-diretor-logado span', 'Olá, diretor(a) ' +config.logado.primeiro_nome]
                        ev.loadDiretor(config.route + 'painel_diretor.html', params)
                    }
                }
            }

        })

    }
}

async function cadastrar(index=0) {
    if (index == 0) {
        let sen = fn.getControl('#text-aluno-senha').value
        let sen2 = fn.getControl('#text-confirmar-senha').value
        if (sen==sen2) {
            await ev.salvarAluno().then(() => {
                if (ev.success) {
                    ev.loadContent(config.route + 'home.html')   
                }
            })

        } else {
            alert('Confirmação da senha não validada. Digite novamente.')
        }

    } else if (index == 1) {
        let sen = fn.getControl('#text-doador-senha').value
        let sen2 = fn.getControl('#text-doador-senha').value
        if (sen==sen2) {
            await ev.salvarDoador().then(() => {
                if (ev.success) {
                    ev.loadContent(config.route + 'home.html')   
                }
            })

        } else {
            alert('Confirmação da senha não validada. Digite novamente.')
        }

    } else if (index == 2) {
        await ev.salvarLivro().then(() => {
            if (ev.success) {
                if (confirm('Cadastro realizado com sucesso. Continuar cadastrando?')) {
                    ev.loadContent(config.route + 'cadastro_livro.html') 
                }
            }
        })
    }

}
