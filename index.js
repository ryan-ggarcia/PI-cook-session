import express from 'express';
import cookieParser from 'cookie-parser'; // importando a biblioteca
import session from 'express-session'
const app = express()

const port = 3000
var usuarios = []

//Para manipular cookies sera necessario instalar o modulo cookie-parser
//para gerenciar uma sessão, sera necessario instalar o moduilo session

//Preparar o servidor a fim de identificar se um determinado usuario esta logado ou nao
// sera preciso criar sessoes na aplicação

app.use(session({
    secret:"minh4cha43secr7ta6", // criptografia para as informações do cliente serem protegidas 
    resave: true, // salvar se mudar o estado da sessao
    saveUninitialized: true, // salvar se a sessao estiver vazia
    //criação de um espaço particular para que as informações do cliente seja armazenada
    cookie:{
        maxAge: 1000 * 60 * 15 // tempo maximo na qual o cliente fica logado(sem interação com a aplicação)
    }    
}))

app.use(express.urlencoded({ extended: true }))
//Preparando o servido para processar os cookes
app.use(cookieParser())
app.get("/",verificaLogin, (req, res) => {
    //verificando a existencia do cookie
    let ultimoAcesso = req.cookies?.ultimoAcesso
    const data = new Date()
    res.cookie("ultimoAcesso", data.toLocaleString()) //Cria um cookie que sera para o cliente 
    res.setHeader("Content-Type", "text/html") // escrevo na minha resposta que o conteudo é html
    res.write(`
        <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                    <title>Projetos para Internet</title>
                    <style>
                    body {
                        background: linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%);
                    }
                        h1 {
                            text-align: center;
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }
                        main {
                            width: 100%;
                            height: 100%;
                            margin: auto;
                            display: flex;
                            justify-content: space-around;
                            align-items: center;
                        }
                        button{
                            margin-right: 10px;
                        }
                    </style>
                </head>
                <body>
                  <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">Menu</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/login">Login</a>
                            </li>
                            <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/logout">Sair</a>
                            </li>
                        </ul>
                        </div>
                        <div class="conteiner-fluid">
                            <div class="d-flex">
                                <div class="p-2">
                                    <h4> Ultimo acesso: ${ultimoAcesso || "Primeiro acesso!"} </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    </nav>
                    <main>
                        <div class="d-flex justify-content-evenly align-items-center flex-row g-3">

                            <a href="/cadForn"><button class="btn btn-primary">Cadastrar Produtos </button></a>

                        
                            <a href="/listaForn"><button class="btn btn-danger">Listar Produtos </button></a>
                        </div>
                    </main>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
                </body>
            </html>
        `)
    res.end()
})
app.get("/login", (req, res) => {
    res.send(`
        <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                    <title>Projetos para Internet</title>
                    <style>
                    body {
                        background: linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%);
                    }
                        h1 {
                            text-align: center;
                        }
                        main {
                            width: 100%;
                            height: 100vh;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        }
                        form{
                            width: 100%;
                            max-width: 400px;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
                            background-color: rgba(255, 255, 255, 0.2);
                            backdrop-filter: blur(18px);
                            webkit-backdrop-filter: blur(10px);
                            filter: drop-shadow(0 0 10px rgba(0,0,0,0.1));
                        }
                        button{
                            margin-right: 10px;
                        }
                        input{
                            box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
                        }
                    </style>
                </head>
                <body>
                    <main>
                        <div class="row">
                            <i class="bi bi-person-circle" style="font-size: 5rem; display: flex; justify-content: center;"></i>
                            <h1>Login</h1>
                        </div>
                        <form method='POST'>
                            <div class="mb-3">
                                <div class="row">
                                    <i class="bi bi-envelope-fill" style="font-size: 1.5rem; margin-right: 10px;"></i>
                                    <label for="email" class="form-label">Email</label>
                                </div>
                                <input type="text" class="form-control" id="email" " name="email">
                            </div>
                            <div class="mb-3">
                                <div class="row">
                                    <i class="bi bi-lock-fill" style="font-size: 1.5rem; margin-right: 10px;"></i>
                                    <label for="senha" class="form-label">Senha</label>
                                </div>
                                <input type="password" class="form-control" id="senha" name="senha">
                            </div>
                            <div class="row-md-3 align-items-end justify-content-end d-flex">
                                <button type="submit" class="btn btn-primary">Entrar</button>
                            </div>
                            
                        </form>
                    </main>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
        </body>
    </html>

        `)
})
app.post("/login",(req,res)=>{
    const {email,senha} = req.body
    if(email == "admin" && senha == "admin"){
        req.session.dadosLogin={ //adicionando uma informação a sessão (Adicionando um objeto)
            logado:true,
            nomeUser: "Administrador"
        }
        res.redirect("/")
    }else{
       res.write(`
            <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                    <title>Projetos para Internet</title>
                    <style>
                    body {
                        background: linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%);
                    }
                        h1 {
                            text-align: center;
                        }
                        main {
                            width: 100%;
                            height: 100vh;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        }
                        form{
                            width: 100%;
                            max-width: 400px;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
                            background-color: rgba(255, 255, 255, 0.2);
                            backdrop-filter: blur(18px);
                            webkit-backdrop-filter: blur(10px);
                            filter: drop-shadow(0 0 10px rgba(0,0,0,0.1));
                        }
                        button{
                            margin-right: 10px;
                        }
                        input{
                            box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
                        }
                    </style>
                </head>
                <body>
                    <main>
                        <div class="row">
                            <i class="bi bi-person-circle" style="font-size: 5rem; display: flex; justify-content: center;"></i>
                            <h1>Login</h1>
                        </div>
                        <form method='POST' action="/login">
                            <div class="mb-3">
                                <div class="row">
                                    <i class="bi bi-envelope-fill" style="font-size: 1.5rem; margin-right: 10px;"></i>
                                    <label for="email" class="form-label">Email</label>
                                </div>
                                <input type="text" class="form-control" id="email" name="email">
                            </div>
                            <div class="mb-3">
                                <div class="row">
                                    <i class="bi bi-lock-fill" style="font-size: 1.5rem; margin-right: 10px;"></i>
                                    <label for="senha" class="form-label">Senha</label>
                                </div>
                                <input type="password" class="form-control" id="senha" name="senha">
                            </div>
                            <div class="row-md-3 align-items-end justify-content-end d-flex">
                                <button type="submit" class="btn btn-primary">Entrar</button>
                            </div>
                        </form>
                        <div>
                                <span class="text-danger">Usuario ou senha incorretos!</span>
                            </div>
                    </main>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
        </body>
    </html>
        `)
    }
})
// função que fica no meio dos ends poites para fazer a verificação se o cliente esta logado
function verificaLogin(req,res,proximo){
    if(req.session?.dadosLogin?.logado){
        proximo()
    }else{
        res.redirect("/login")
    }
}
app.get("/logout", (req,res) =>{
    req.session.destroy()
    res.redirect("/login")
})
app.get("/cadForn",verificaLogin, (req, res) => {
    res.send(`
        <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                    <title>Projetos para Internet</title>
                    <style>
                    body {
                        background: linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%);
                    }
                        h1 {
                            text-align: center;
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }
                        main {
                            width: 60%;
                            margin: auto;
                        }
                        input{
                            box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
                        }
                        button{
                            margin-top: 20px;
                            margin-right: 10px;
                        }
                    </style>
                </head>
                <body>
                    <main>
                        <h1>Cadastrar Fornecedor</h1>
                        <form method="POST" action="/validaForn">
                            <div class="mb-3">
                                    <label for="formGroupExampleInput" class="form-label">Codigo de barras</label>
                                    <input type="number" class="form-control" id="formGroupExampleInput" name="codBarras" placeholder="Digite o Codigo de carras aqui">
                            </div>
                            <div class="row g-3">
                                <div class="col">
                                    <label type="text">Descrição do produto</label>
                                    <input type="text" class="form-control" placeholder="Descrição do produto" aria-label="First name" id="desc" name="desc">
                                </div>
                                <div class="col">
                                    <label type="text">Preço de custo</label>
                                    <input type="text" class="form-control" placeholder="Preço de custo" aria-label="Last name" id="pc" name="pc">
                                </div>
                            </div>
                            <div class="row g-3">
                                <div class="col">
                                    <label type="text">Preço de venda</label>
                                    <input type="text" class="form-control" placeholder="Preço de venda" aria-label="First name" id="pv" name="pv">
                                </div>
                                <div class="col">
                                    <label type="text">Data de validade</label>
                                    <input type="date" class="form-control" placeholder="Data de validade do produto" aria-label="Last name" id="data" name="data">
                                </div>
                            </div>
                           
                            <div class="col">
                                <label type="text">Quantidade em estoque</label>
                                <input type="text" class="form-control" placeholder="Quantidade no estoque" aria-label="First name" id="qtd" name="qtd">
                            </div>
                            <div class="row g-3">
                                <div class="col">
                                    <label type="text">Nome do fabricante</label>
                                    <input type="text" class="form-control" placeholder="Nome do Fabricante" aria-label="First name" id="nome" name="nome">
                                </div>
                            </div>
                            <div class="row-md-3 align-items-end justify-content-end d-flex">
                                <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
                                <a href="/"><button type="button" class="btn btn-danger">Cancelar</button></a>
                            </div>
                        </form>
                    </main>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
    </html>
        `)
})
app.post("/validaForn",verificaLogin, (req, res) => {
    const cod = req.body.codBarras
    const nome = req.body.nome
    const desc = req.body.desc
    const pc = req.body.pc
    const pv = req.body.pv
    const data = req.body.data
    const qtd = req.body.qtd
    if (desc && cod && pc && pv && nome && data && qtd ) {
        usuarios.push({ cod, pc, pv, desc, nome, data, qtd})
        res.redirect("/listaForn")
    } else {
        let conteudo = `
         <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                    <title>Projetos para Internet</title>
                    <style>
                    body {
                        background: linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%);
                    }
                        h1 {
                            text-align: center;
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }
                        main {
                            width: 60%;
                            margin: auto;
                        }
                        input{
                            box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
                        }
                        button{
                            margin-top: 20px;
                            margin-right: 10px;
                        }
                    </style>
                </head>
                <body>
                    <main>
                        <h1>Cadastrar Fornecedor</h1>
                        <form method="POST" action="/validaForn">
                            <div class="mb-3">
                                    <label for="formGroupExampleInput" class="form-label">Codigo de barras</label>
                                    <input type="number" class="form-control" id="formGroupExampleInput" name="codBarras" placeholder="Digite o Codigo de carras aqui" value="${cod}">
                            
            `
        if (!cod) {
            conteudo += `
                    <div>
                        <span class="text-danger">Codigo de barras é obrigatório</span>
                    </div>
                `
        }
        conteudo += `
                </div>
                <div class="row g-3">
                                <div class="col">
                                    <label type="text">Descrição do produto</label>
                                    <input type="text" class="form-control" placeholder="Descrição do produto" aria-label="First name" id="desc" name="desc" value="${desc}">
            `
        if (!desc) {
            conteudo += `
                    <div>
                        <span class="text-danger">Descrição do produto é obrigatório</span>
                    </div> 
                `
        }
        conteudo += `
                </div>
                    <div class="col">
                                    <label type="text">Preço de custo</label>
                                    <input type="text" class="form-control" placeholder="Preço de custo" aria-label="Last name" id="pc" name="pc" value="${pc}">
                `
        if (!pc) {
            conteudo += `
                    <div>
                        <span class="text-danger">O preco de custo é obrigatório</span>
                    </div>
                `
        }
        conteudo += `
                    </div>
                    </div>
               <div class="col">
                                    <label type="text">Preço de venda</label>
                                    <input type="text" class="form-control" placeholder="Preço de venda" aria-label="First name" id="pv" name="pv" value="${pv}">
            `

        if (!pv) {
            conteudo += `
                    <div>
                        <span class="text-danger">O preço de venda é obrigatório</span>
                    </div>
                `
        }
        conteudo += `
                    </div>
                    <div class="col">
                                    <label type="text">Data de validade</label>
                                    <input type="date" class="form-control" placeholder="Data de validade do produto" aria-label="Last name" id="data" name="data">
                                </div>
                `
        if (!data) {
            conteudo += `
                    <div>
                        <span class="text-danger">A data de validade é obrigatória</span>
                    </div>
                `
        }
        conteudo += `
                    </div>
                         <div class="col">
                                <label type="text">Quantidade em estoque</label>
                                <input type="text" class="form-control" placeholder="Quantidade no estoque" aria-label="First name" id="qtd" name="qtd">
                            </div>
                `
        if (!qtd) {
            conteudo += `
                    <div>
                        <span class="text-danger">A quantidade é obrigatório</span>
                    </div>
            `
        }
        conteudo += `
                </div>
                </div>
                    <div class="row g-3">
                       <div class="col">
                                    <label type="text">Nome do fabricante</label>
                                    <input type="text" class="form-control" placeholder="Nome do Fabricante" aria-label="First name" id="nome" name="nome">
                                </div>
                `
        if (!nome) {
            conteudo += `
                    <div>
                        <span class="text-danger">O nome do fornercedor é obrigatório</span>
                    </div>
            `
        }
        conteudo += `
            </div>
                            </div>
                            <div class="row-md-3 align-items-end justify-content-end d-flex">
                                <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
                                <a href="/"><button type="button" class="btn btn-danger">Cancelar</button></a>
                            </div>
                        </form>
                    </main>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </body>
        </html>
        `
        res.send(conteudo)
    }
})
app.get("/listaForn",verificaLogin, (req, res) => {
    if (!usuarios.length) {
        res.send("<h1>Não há Produtos cadastrados</h1><a href='/'><button class='btn btn-danger'>Voltar</button></a>")
    } else {

        let conteudo = `
         <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
                    <title>Projetos para Internet</title>
                    <style>
                    body {
                        background: linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%);
                    }
                        h1 {
                            text-align: center;
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }
                        main {
                            width: 60%;
                            margin: auto;
                        }
                        input{
                            box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
                        }
                        button{
                            margin-top: 20px;
                            margin-right: 10px;
                        }
                        .table {
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <main>
                        <h1>Lista de Produtos</h1>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Codigo de barras</th>
                                    <th>Descrição do produto</th>
                                    <th>Preço de custo</th>
                                    <th>Preço de venda</th>
                                    <th>Data de validade</th>
                                    <th>Quantidade em estoque</th>
                                    <th>Nome da fabricante</th>
                                </tr>
                            </thead>
                            <tbody>
    `
        for (let i = 0; i < usuarios.length; i++) {
            conteudo += `
            <tr>
                <td>${usuarios[i].cod}</td>
                <td>${usuarios[i].desc}</td>
                <td>${usuarios[i].pc}</td>
                <td>${usuarios[i].pv}</td>
                <td>${usuarios[i].data}</td>
                <td>${usuarios[i].qtd}</td>
                <td>${usuarios[i].nome}</td>
            </tr>
    `
        }
        conteudo += `
                            </tbody>
                        </table>
                        <div class="row-md-3 align-items-end justify-content-end d-flex">
                            <a href="/cadForn"><button class="btn btn-primary">Cadastrar Novo Produto</button></a>
                            <a href="/"><button class="btn btn-danger">Voltar</button></a>
                        </div>
                    </main>
                </body>
            </html>
        `
        res.send(conteudo)
    }
})
app.listen(port, () => {
    console.log(`Servidor online na porta:${port} `)
})