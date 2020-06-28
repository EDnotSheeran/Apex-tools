function navbarToggle() {
    $('#navbar').classList.toggle('toggle-hidden')    
}
function $(element){
    return document.querySelector(element)
}
function submitForm(){
    arrColums = Array.prototype.slice.call(document.getElementsByClassName('colum'));
    const table = document.querySelector('#Table') // Campo de tabela
    //Json
    let change = []
    arrColums.map(item=>{
        change.push(`'${item.value.trim()}' VALUE ${table.value.trim()}_${item.value.trim()}`)
    })
    $('#Convert-area-json').value = `JSON_OBJECT(\n {change} \nFORMAT JSON)`.replace('{change}',change.join(',\n'))
    // Aliasign
    let change2 = []
    arrColums.map(item=>{
        change2.push(`${table.value.trim()}.${item.value.trim()} as ${table.value.trim()}_${item.value.trim()}`)
    })
    $('#Convert-area-select').value = `--${table.value.trim()}\n` + change2.join(',\n')

    window.scrollTo(0,600)
}
function addColum(){
    const el = document.createElement('input')
    el.classList.add('colum')
    el.setAttribute('type','text')
    $('#Colums-inputs').appendChild(el)
}
function removeColum(){
    $('#Colums-inputs').removeChild($('#Colums-inputs').lastChild);
}