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

                            <a href="/cadForn"><button class="btn btn-primary">Cadastrar Fornecedores </button></a>

                        
                            <a href="/listaForn"><button class="btn btn-danger">Listar Fornecedores </button></a>
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
                                    <label for="formGroupExampleInput" class="form-label">CNPJ</label>
                                    <input type="text" class="form-control" id="formGroupExampleInput" name="cnpj" placeholder="Digite o CNPJ aqui">
                            </div>
                            <div class="row g-3">
                                <div class="col">
                                    <label type="text">Razão Social</label>
                                    <input type="text" class="form-control" placeholder="Razão Social" aria-label="First name" id="nomeS" name="nomeS">
                                </div>
                                <div class="col">
                                    <label type="text">Nome fantasia</label>
                                    <input type="text" class="form-control" placeholder="Nome Fantasia" aria-label="Last name" id="nomeF" name="nomeF">
                                </div>
                            </div>
                            <div class="row g-3">
                                <div class="col">
                                    <label type="text">Endereço</label>
                                    <input type="text" class="form-control" placeholder="Endereço" aria-label="First name" id="address" name="address">
                                </div>
                                <div class="col">
                                    <label type="text">Cidade</label>
                                    <input type="text" class="form-control" placeholder="Cidade" aria-label="Last name" id="city" name="city">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label for="txt" class="form-label">UF</label>
                                    <select class="form-select" id="uf" name="uf">
                                        <option selected disabled value="">Escolha</option>
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">Distrito Federal</option>
                                        <option value="ES">Espírito Santo</option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">Mato Grosso do Sul</option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piauí</option>
                                        <option value="RJ">Rio de Janeiro</option>
                                        <option value="RN">Rio Grande do Norte</option>
                                        <option value="RS">Rio Grande do Sul</option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">Santa Catarina</option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                    </select>
                            </div>
                            <div class="col">
                                <label type="text">CEP</label>
                                <input type="text" class="form-control" placeholder="CEP" aria-label="First name" id="cep" name="cep">
                            </div>
                            <div class="row g-3">
                                <div class="col">
                                    <label type="text">Email</label>
                                    <input type="text" class="form-control" placeholder="Email" aria-label="First name" id="email" name="email">
                                </div>
                                <div class="col">
                                    <label type="text">Telefone</label>
                                    <input type="text" class="form-control" placeholder="Telefone" aria-label="Last name" id="phone" name="phone">
                                </div>
                            </div>
                            <div class="row-md-3 align-items-end justify-content-end d-flex">
                                <button type="submit" class="btn btn-primary">Cadastrar Fornecedor</button>
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
    const cnpj = req.body.cnpj
    const nomeS = req.body.nomeS
    const nomeF = req.body.nomeF
    const address = req.body.address
    const cep = req.body.cep
    const city = req.body.city
    const email = req.body.email
    const tel = req.body.phone
    const uf = req.body.uf
    if (nomeS && nomeF && address && cep && city && email && tel && uf) {
        usuarios.push({ nomeS, nomeF, address, cep, city, email, tel, uf })
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
                                <label for="cnpj" class="form-label">CNPJ</label>
                                <input type="text" class="form-control" id="cnpj" name="cnpj" placeholder="Digite o CNPJ aqui" value="${cnpj}">
                            
            `
        if (!cnpj) {
            conteudo += `
                    <div>
                        <span class="text-danger">CNPJ é obrigatório</span>
                    </div>
                `
        }
        conteudo += `
                </div>
                <div class="row g-3">
                    <div class="col">
                        <label type="text">Razão Social</label>
                        <input type="text" class="form-control" placeholder="Razão Social" aria-label="First name" id="nomeS" name="nomeS" value="${nomeS}">
            `
        if (!nomeS) {
            conteudo += `
                    <div>
                        <span class="text-danger">Nome Social é obrigatório</span>
                    </div> 
                `
        }
        conteudo += `
                </div>
                    <div class="col">
                            <label type="text">Nome fantasia</label>
                            <input type="text" class="form-control" placeholder="Nome Fantasia" aria-label="Last name" id="nomeF" name="nomeF" value="${nomeF}">
                `
        if (!nomeF) {
            conteudo += `
                    <div>
                        <span class="text-danger">Nome Fantasia é obrigatório</span>
                    </div>
                `
        }
        conteudo += `
                    </div>
                    </div>
                <div class="row g-3">
                    <div class="col">
                        <label type="text">Endereço</label>
                        <input type="text" class="form-control" placeholder="Endereço" aria-label="First name" id="address" name="address" value="${address}">
            `

        if (!address) {
            conteudo += `
                    <div>
                        <span class="text-danger">Endereço é obrigatório</span>
                    </div>
                `
        }
        conteudo += `
                    </div>
                    <div class="col">
                        <label type="text">Cidade</label>
                        <input type="text" class="form-control" placeholder="Cidade" aria-label="Last name" id="city" name="city" value="${city}">
                `
        if (!city) {
            conteudo += `
                    <div>
                        <span class="text-danger">Cidade é obrigatória</span>
                    </div>
                `
        }
        conteudo += `
                    </div>
                </div>
                    <div class="col-md-3">
                        <label for="txt" class="form-label">UF</label>
                            <select class="form-select" id="uf" name="uf" value="${uf}">
                                <option selected disabled value="">Escolha</option>
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option>
                            </select>
            `
        if (!uf) {
            conteudo += `
                    <div>
                        <span class="text-danger">A Uf é obrigatória</span>
                    </div>
            `
        }
        conteudo += `
                    </div>
                        <div class="col">
                            <label type="text">CEP</label>
                            <input type="text" class="form-control" placeholder="CEP" aria-label="First name" id="cep" name="cep" value="${cep}">
                `
        if (!cep) {
            conteudo += `
                    <div>
                        <span class="text-danger">CEP é obrigatório</span>
                    </div>
            `
        }
        conteudo += `
                </div>
                </div>
                    <div class="row g-3">
                        <div class="col">
                            <label type="text">Email</label>
                            <input type="text" class="form-control" placeholder="Email" aria-label="First name" id="email" name="email" value="${email}">
                `
        if (!email) {
            conteudo += `
                    <div>
                        <span class="text-danger">E-mail é obrigatório</span>
                    </div>
            `
        }
        conteudo += `
                </div>
                    <div class="col">
                        <label type="text">Telefone</label>
                        <input type="text" class="form-control" placeholder="Telefone" aria-label="Last name" id="phone" name="phone" value="${tel}">
                `
        if (!tel) {
            conteudo += `
                    <div>
                        <span class="text-danger">Telefone é obrigatório</span>
                    </div>
            `
        }

        conteudo += `
            </div>
                            </div>
                            <div class="row-md-3 align-items-end justify-content-end d-flex">
                                <button type="submit" class="btn btn-primary">Cadastrar Fornecedor</button>
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
        res.send("<h1>Não há fornecedores cadastrados</h1><a href='/'><button class='btn btn-danger'>Voltar</button></a>")
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
                        <h1>Lista de Fornecedores</h1>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nome Social</th>
                                    <th>Nome Fantasia</th>
                                    <th>Endereço</th>
                                    <th>Cidade</th>
                                    <th>UF</th>
                                    <th>CEP</th>
                                    <th>Email</th>
                                    <th>Telefone</th>
                                </tr>
                            </thead>
                            <tbody>
    `
        for (let i = 0; i < usuarios.length; i++) {
            conteudo += `
            <tr>
                <td>${usuarios[i].nomeS}</td>
                <td>${usuarios[i].nomeF}</td>
                <td>${usuarios[i].address}</td>
                <td>${usuarios[i].city}</td>
                <td>${usuarios[i].uf}</td>
                <td>${usuarios[i].cep}</td>
                <td>${usuarios[i].email}</td>
                <td>${usuarios[i].tel}</td>
            </tr>
    `
        }
        conteudo += `
                            </tbody>
                        </table>
                        <div class="row-md-3 align-items-end justify-content-end d-flex">
                            <a href="/cadForn"><button class="btn btn-primary">Cadastrar Novo Fornecedor</button></a>
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