let novaTransacao = document.querySelector('.button.new')
let modalOverlay = document.querySelector('.modal-overlay')
let btnSalvar = document.querySelector('.input-group.actions button')
let cancelar = document.querySelector('.button.cancel')
let tabela = document.querySelector('#data-table tbody')
let totalEntradas =  Number(localStorage.getItem("entradaSalva"))
let entradas = document.querySelector('#incomeDisplay')
let totalSaidas = Number(localStorage.getItem("saidasSalvo"))
let saidas = document.querySelector('#expenseDisplay')
let valorTotal = Number(localStorage.getItem("totalSalvo"))
let total = document.querySelector('#totalDisplay')
let valorExcluir = 0


let modal = {

    open(){
        modalOverlay.classList.add('active')
    },
    close(){
        modalOverlay.classList.remove('active')
    }
}

novaTransacao.addEventListener("click", modal.open)
cancelar.addEventListener("click", modal.close)
btnSalvar.addEventListener('click',adicionar)


function formatDate(data){
    const splittedData = data.split("-")
    return `${splittedData[2]}/${splittedData[1]}/${splittedData[0]} `
}

function formatValues(valor){
    valor = Math.round(Number(valor) * 100 )

    let signal = valor < 0 ? "-" : ""

    valor = String(valor).replace(/\D/g, "")

    valor = Number(valor) / 100

    
    valor = valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    
    return signal + valor
}

//Adicionar na tabela
function adicionar(){
    document.querySelector('.modal form').addEventListener("click", function(event){
        event.preventDefault()
      });
    let descricao = document.querySelector('#description').value
    let valor = document.querySelector('#amount').value
    // valor = formatvalues(valor)
    let data = document.querySelector('#date').value
    
    
    // Validação formulário
    if(descricao == "" || valor == "" || data == ""){
        alert("Preencha todos os campos para continuar")
        return
    }
    data = formatDate(data)

    let cssClass = valor < 0 ? "expense" : "income"

    tabela.innerHTML += ` 
    <tr>
        <td class="description">${descricao}</td>
        <td class="${cssClass}"> ${formatValues(valor)}</td>
        <td class="date">${data}</td>
        <td><img id="delet" onclick="excluir(this)" src="./assets/minus.svg" alt="botão para excluir da tabela"></td>
    </tr>`
    if(valor < 0){
        saida(valor)
        somaTotal(valor)
    }
    else{
        entrada(valor)
        somaTotal(valor)
    }

    modalOverlay.classList.remove('active')
    let inputs = document.getElementsByTagName('input')
    for(input of inputs){
        input.value = ""
    }
}

  

function entrada(v){
    // totalEntradas = totalEntradas + Number(v)
    totalEntradas += Number(v)
    entradas.innerHTML = formatValues(totalEntradas)
    salvar()
}


function saida(v){
    // totalSaidas = totalSaidas + Number(v)
    totalSaidas += Number(v)
    saidas.innerHTML = formatValues(totalSaidas)
    salvar()
}


function somaTotal(v){
    // valorTotal = valorTotal + Number(v)
    valorTotal += Number(v)
    total.innerHTML = formatValues(valorTotal)
    salvar()
}


function excluir(element){
    let tr = element.parentElement.parentElement
    let inputNumber = (tr.children[1].innerHTML)
    if(inputNumber.includes('-')){
        inputNumber = inputNumber.replace(/\D/g,'');
        saida(Math.abs(inputNumber) / 100)
        somaTotal(Math.abs(inputNumber) / 100)
    }
    else{
        inputNumber = inputNumber.replace(/\D/g,'');
        entrada(-Math.abs(inputNumber) / 100)
        somaTotal(-Math.abs(inputNumber) / 100)
    }
    element.parentElement.parentElement.remove()
    salvar(tabela)  
}

    

function salvar(){
    let tableStorage = tabela.innerHTML
    localStorage.setItem("tabelaSalva", tableStorage)
    localStorage.setItem("entradaSalva", totalEntradas)
    localStorage.setItem("saidasSalvo",totalSaidas)
    localStorage.setItem("totalSalvo", valorTotal)
}


window.onload = () =>{
    // localStorage.clear()

   let getTable =localStorage.getItem("tabelaSalva")
   tabela.innerHTML = getTable

   let getEntradas = localStorage.getItem("entradaSalva")
   entradas.innerHTML = getEntradas == null ? 'R$ 0,00' : formatValues(getEntradas)

   let getSaidas = localStorage.getItem("saidasSalvo")
   saidas.innerHTML = getSaidas == null ? 'R$ 0,00' : formatValues(getSaidas)

   let getTotal = localStorage.getItem("totalSalvo")
   total.innerHTML = getTotal == null ? 'R$ 0,00' : formatValues(getTotal)
}
