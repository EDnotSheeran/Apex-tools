const jsonTemplate = `JSON_OBJECT(\n {change} \nFORMAT JSON)` // template
const form = document.querySelector('#Form') // Formulario
const table = document.querySelector('#Table') // Campo de tabela
const colums = document.getElementsByClassName('colum') // Campo de colunas
const columsInputs = document.querySelector('#Colums-inputs') // Div com os Campos de Colunas
const convetAreaJson = document.getElementById('Convert-area-json') // Textarea do Json
const convetAreaSelect = document.getElementById('Convert-area-select') //Text area do Aliasgn
// Previne o formulario de dar Submit
form.addEventListener('submit',form =>{
    form.preventDefault()
})
function submitForm(){
    arrColums = Array.prototype.slice.call(colums);
    //Json
    let change = []
    arrColums.map(item=>{
        change.push(`'${item.value.trim()}' VALUE ${table.value.trim()}_${item.value.trim()}`)
    })
    convetAreaJson.value = jsonTemplate.replace('{change}',change.join(',\n'))
    // Aliasign
    let change2 = []
    arrColums.map(item=>{
        change2.push(`${table.value.trim()}.${item.value.trim()} as ${table.value.trim()}_${item.value.trim()}`)
    })
    convetAreaSelect.value = `--${table.value.trim()}\n` + change2.join(',\n')
}
function addColum(){
    const el = document.createElement('input')
    el.classList.add('colum')
    el.setAttribute('type','text')
    columsInputs.appendChild(el)
}
function removeColum(){
    columsInputs.removeChild(columsInputs.lastChild);
}