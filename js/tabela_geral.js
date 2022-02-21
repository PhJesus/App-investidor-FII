/*
Projeto feito por:
Henrique Lopes da Silva - 26310562
Letícia Andrade de França - 28211740
Pedro Henrique Jesus - 27141276 
Raphael Bispo Elias - 26138051
*/ 
"use strict"

let fii_user = [];
let fii_table = [];

// colocar os dados do fii.json dentro das arrays
async function carregarDadosUser(url){ 
    await fetch(url)
            .then(resp => resp.json())
            .then(json => fii_user = json);
    carregarDadosFundos();
}

 // repetição pra pegar as informações do fii_user
async function carregarDadosFundos(){
    for (let i = 0; i < fii_user.length; i++){
        let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${fii_user[i].nome}`)
                        .then(resp => resp.json());
        fii_table.push(json);  
    }

    // comando pra sumir o loading após finalizar o carregamento
    document.querySelector("#loading").style.display = "none";
    exibirTabela();
}

carregarDadosUser("json/fii.json");

// declaração da função de exibir a tabela
function exibirTabela(){ 
    let proxRendimentoSoma = 0
    let qtdeSoma = 0
    let totalgastoSoma = 0
    let corFundo = ""

    for (let j = 0; j < fii_table.length; j++){
        let rendimento = fii_table[j].proximoRendimento.rendimento
        let dataBase = fii_table[j].proximoRendimento.dataBase
        let dataPag = fii_table[j].proximoRendimento.dataPag

        // verificação de valores nulos e/ou vazios
        if (rendimento == "-") {rendimento = String(fii_table[j].ultimoRendimento.rendimento)}
        if (dataBase == "-") {dataBase = String(fii_table[j].ultimoRendimento.dataBase)}
        if (dataPag == "-") {dataPag = String(fii_table[j].ultimoRendimento.dataPag)}

        // determina a cor da linha
        ((rendimento*100)/fii_table[j].valorAtual >= 0.60) ? corFundo = "positivo" : corFundo = "negativo";
        
        // somatória dos valores
        proxRendimentoSoma += parseFloat(rendimento) * fii_user[j].qtde;
        qtdeSoma += fii_user[j].qtde;
        totalgastoSoma += fii_user[j].totalgasto;

        // construção da tabela
        let tabela = document.querySelector("table").innerHTML += 
        `<tr class = ${corFundo}>
            <td>   ${(fii_user[j].nome).toUpperCase()}</td>
            <td>   ${fii_table[j].setor}</td>
            <td>   ${dataBase}</td>
            <td>   ${dataPag}</td>
            <td>R$ ${rendimento}</td>
            <td>R$ ${fii_table[j].valorAtual}</td>
            <td>   ${fii_user[j].qtde}</td>
            <td>R$ ${fii_user[j].totalgasto}</td>
            <td>R$ ${(fii_user[j].totalgasto / fii_user[j].qtde).toFixed(2)}</td>
            <td>   ${((rendimento*100)/fii_table[j].valorAtual).toFixed(2)}%</td>
            <td>   ${fii_table[j].dividendYield}%</td>
            <td>R$ ${fii_table[j].rendimentoMedio24M}</td>
        </tr>`
    }


    // linha final com todas as somas
    tabela = document.querySelector("table").innerHTML += 
    `<tr class = fundo_total>
        <td colspan = "4">Total Geral:</td> 
        <td>R$ ${proxRendimentoSoma.toFixed(2)}</td>
        <td> </td>
        <td>   ${qtdeSoma}</td>
        <td>R$ ${totalgastoSoma.toFixed(2)}</td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
    </tr>` 
}