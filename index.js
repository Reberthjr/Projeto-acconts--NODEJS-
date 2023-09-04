const inquirer = require("inquirer")
const chalk = require('chalk')
const fs = require('fs')


operation()

function operation(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'o que você deseja fazer?',
        choices:['Criar conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair']
    },
])
.then((answer)=>{
    const action = answer['action']

   if(action === 'Criar conta'){
    createAccount()
   }else if( action === 'Consultar Saldo'){
    getAccountBalance()
   }else if( action === 'Depositar'){
    deposit()
   }else if( action === 'Sacar'){
    withdraw()
   }else if( action === 'Sair'){
    console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
    process.exit()
   }
})
  .catch((err)=> console.log(err))
}

//create an account     

function createAccount () {
    console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))
 
    buildAccount();
}

/// FUNÇÃO PARA CRIAÇÃO DE CONTA

function buildAccount(){

    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para sua conta:'
    }
]).then(answer =>{
    const accountName = answer['accountName']
 console.info(accountName)

 if(!fs.existsSync('accounts')){
    fs.mkdirSync('accounts')
 }
 if(fs.existsSync(`accounts/${accountName}.json`)){
    console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
    buildAccount()
    return
 }
 fs.writeFileSync(`accounts/${accountName}.json`,'{"balance":0}', function(err){

    console.log(err)
 },
 )
 console.log(chalk.green('Parabéns sua conta foi criada!'))
 operation()

}).catch(err => console.log(err))
}
//// FUNÇÃO  VERIFICAR SE CONTA  EXISTE


function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não exite, escolha outra conta para continuar!'))
        return false
    }
    return true
}
///FUNÇÃO ADICIONAR VALOR

function addAmount(accountName, amount){

    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('O correu um erro, tente novamente mais tarde!'))
        return deposit()
    }
    accountData.balance = parseFloat(amount)+parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        }
    )
    console.log(chalk.green(`Foi deporistado o valor de R$ ${amount} em sua conta!`))
}

///FUNÇÃO PEGAR NOME DA CONTA

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{
        encoding: 'utf-8',
        flag:'r'
    })
    return JSON.parse(accountJSON); // Parse the JSON string into a JavaScript object
}

/////// FUNÇÃO PARA DEPOSITO

function deposit(){
    inquirer.prompt([{
        name :'accountName',
        message : 'Qual o nome da sua conta?'
    }]).then((answer)=>{
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return deposit()
        }
        inquirer.prompt([{
            name:'amount',
            message:'Quanto você deseja depositar?'
        },
    ]).then((answer) =>{
       const amount = answer['amount']
       //add amount
       addAmount(accountName, amount)
       operation()
       
    }).catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}
//MOSTRAR SALDO DA CONTA

function getAccountBalance(){
    inquirer.prompt([
        {
        name:'accountName',
        message:'Qual nome da sua conta?'
    }
]).then((answer=>{
        const accountName = answer["accountName"]
        //VALIDAÇÃO
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(
            `Olá, o saldo da sua conta é de R$ ${accountData.balance}`
        
            ),
        )
        operation()

    })).catch(err => console.log(err))
}

//FUNÇÃO DE SAQUE
function withdraw(){

    inquirer.prompt([{
        name:'accountName',
        message:'Qual nome da sua conta?'
    }]).then((answer => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return withdraw()
        }
        inquirer.prompt([{
            name:'amount',
            message:'Quanto você deseja sacar ?'
        }]).then((answer)=>{
            const amount = answer['amount']
            removeAmount(accountName,amount)
            

        }).catch(err => console.log(err))
    }
    )).catch(err => console.log(err))
}

function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return withdraw()
    }
    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('Valor insuficiente!'))
        return withdraw()
    }
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err){
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi realizado um saque de R$ ${amount} da sua conta!`))
    operation()
}
