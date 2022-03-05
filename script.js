const Modal = {

    open(){
        // ABRIR O MODAL ADICONAR A CLASS ACTIVE AO MODAL
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close(){
        //FECHAR O MODAL E REMOVER A CLASS ACTIVE DO MODAL
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}


const Storage = {
    //RETORNA CONTEÚDO SALVO NO LOCAL STORAGE
    get(){
        return JSON.parse(localStorage.getItem("finances-transaction")) || []
    },

    //SALVA CONTEÚDO NO LOCAL STORAGE
    set(){
        localStorage.setItem("finances-transaction", JSON.stringify(Transaction.all) )
    },

    //LIMPA TODO O CONTEÚDO DO STORAGE E DA PÁG
    clearAll(){
        localStorage.clear()
        Transaction.all = []
        App.reload()
    }
}


const Transaction = {
    all: Storage.get(),

    //ADICIONA TRANSAÇÃO NO ARRAY E FAZ CHAMADA RELOAD DO APP PARA ATUALIZAR A PAG
    addTransaction(Transaction){
        this.all.push(Transaction)
        App.reload()

    },

    //REMOVE TRANSAÇÃO DO ARRAY E FAZ CHAMADA RELOAD DO APP PARA ATUALIZAR A PAG
    remove(index){
        this.all.splice(index, 1)
        App.reload()
    },

    //FAZ A SOMA DAS ENTRADAS
    incomes(){
        let income = 0 
        //PARA CADA TRANSAÇÃO SE FOR MAIOR QUE ZERO FAZER INCREMENTO DAS ENTRADAS
        Transaction.all.forEach( Transaction => {
            if(Transaction.amount > 0 ){
                income += Transaction.amount
            }
        })
        return income
    },

    //FAZ A SOMA DAS SAÍDAS
    expenses(){
        let expense = 0 
        //PARA CADA TRANSAÇÃO SE FOR MENOR QUE ZERO FAZER INCREMENTO DAS SAÍDAS
        Transaction.all.forEach( Transaction => {
            if(Transaction.amount < 0 ){
                expense += Transaction.amount
            }
        })
        return expense
    },

    //RETORNO DO TOTAL 
    total(){
        return this.incomes() + this.expenses()
    }
}


const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    //ADICIONA NOVAS TRANSAÇÕES NA TABELA
    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHtmltranssaction(transaction,index)
        tr.dataset.index = index
        this.transactionsContainer.appendChild(tr)

    },

    //ADICIONA NOVAS TRANSAÇÕES NA TABELA
    innerHtmltranssaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}"> ${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="Transaction.remove(${index})" id="delet" src="./assets/minus.svg" alt="botão para excluir da tabela"></td>
        `
        return html
    },

    //FAZ UPDATE DOS VALORES NOS CARDS ENTRADAS, SAÍDAS, TOTAL
    updateBalance(){
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurency(Transaction.expenses())

        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurency(Transaction.total())
    },

    clearTransactions(){
        this.transactionsContainer.innerHTML = ""
    }
}


const Utils = {
    //FAZ FORMATAÇÃO DO VALOR INSERIDO NO INPUT PARA NÚMERO REMOVENDO VÍRGULAS E PONTOS
    formatAmount(value){
        value = Number(value) * 100 
        return Math.round(value)
    },

    //FAZ FORMATAÇÃO DA DATA PARA PADRÃO DD/MM/YY
    formatData(date){
        const splittedDate = date.split("-") //retorna array da var sem o elemento do parenteses
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    //FAZ FORMATAÇÃO DA MOEDA 
    formatCurency(value){
        
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description : document.querySelector('input#description'),
    amount : document.querySelector('input#amount'),
    date : document.querySelector('input#date'),

    //MÉTODO PARA PEGAR VALORES DIGITADOS NOS INPUTS
    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value   
        }
    },

    //MÉTODO PARA FAZER VALIDAÇÃO DO FORMULÁRIO
    validateFields(){
        const {description, amount, date} = Form.getValues() // desconstruir objeto

        //SE ENTRADAS DO INPUT FOREM IGUAL A VAZIO LANÇAR ERRO 
        if(description.trim() === "" || amount.trim() === "" || date.trim() ===""){
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    //MÉTODO RECEBE FORMATAÇÃO DOS VALORES DE ENTRADA DOS INPUTS
    formatValues(){
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatData(date)

        return{
            description,
            amount,
            date
        }
    },

    //MÉTODO LIMPA OS INPUTS NO MODAL
    clearFields(){
        this.description.value = ""
        this.amount.value = ""
        this.date.value = ""
    },

    //MÉTODO INVOCADO NO SUBMIT DO FORMULÁRIO 
    submit(event){
        event.preventDefault()  
        try{
            //VERIFICAR SE TODAS AS INFORMAÇÕES FORAM PREENCHIDAS
            Form.validateFields()
            //FORMATAR VALORES DO INPUT PARA NUMERO FORMATAR OS DADOS PARA SALVAR
            const transactionFormated = this.formatValues()
            //SALVAR
            Transaction.addTransaction(transactionFormated)
            //LIMPAR OS INPUTS
            Form.clearFields()
            //FECHAR O MODAL 
            Modal.close()

        }catch(error){
            alert(error.message)
        } 
   }
}


const App = {
    //INICIA A PAG 
    init(){
        Transaction.all.forEach((transaction,index)=>{
        DOM.addTransaction(transaction,index)
        })

        DOM.updateBalance() 
        Storage.set(Transaction.all)
    },

    // FAZ UPDATE DA PAG
    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init()


document
    .querySelector('.button.new')
    .addEventListener("click",Modal.open)

document
    .querySelector('.button.cancel')
    .addEventListener("click",Modal.close)

document
    .querySelector('.button.clear')
    .addEventListener("click", Storage.clearAll )



