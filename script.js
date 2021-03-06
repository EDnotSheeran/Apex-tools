function $(element,all = false){
    if(all){
        return document.querySelectorAll(element)
    }else{
        return document.querySelector(element)
    }
}
// Liga e Desliga a navbar no modo Mobile
function navbarToggle() {
    $('#navbar').classList.toggle('toggle-hidden')    
}
// Adiciona um input de coluna no formulario
function addColum(){
    let input = document.createElement('input')
    input.classList.add('colum')
    input.setAttribute('type','text')
    input.setAttribute('oninput','setSelectPrimaryKey()')
    document.getElementById('Colums-inputs').appendChild(input)
}
// Remove um input de coluna no formulario
function removeColum(){
    $('#Colums-inputs').removeChild($('#Colums-inputs').lastChild);
}
// Muda o elemento do carrosel
function carrouselToggle(num){
    var carrousel = document.querySelector('div#carrousel')
    const oi = Array.prototype.slice.call(carrousel.children)
    oi.map(item=>{
        item.classList.remove('active')
    })
    oi[num].classList.add('active')
}
// Faz as convercoes e exibe nas areas de texto
function submitForm(){
    let arrColums = Array.prototype.slice.call(document.getElementsByClassName('colum'))
    let table = $('#Table') // Campo de tabela
    table = table.value.trim().toUpperCase()
    let pk = getSelectPrimaryKey()
    console.log(pk)
    if(pk === ''){
        alert('Selecione uma chave primaria')
        return
    }
    //Json
    $('#Convert-area-json').value = getJson(table,arrColums)
    // Aliasign
    $('#Convert-area-select').value = getAliasing(table, arrColums)
    // GET one
    $('#Convert-area-get-one').value = getGetOne(table, arrColums, pk)
    $('#uri-one').innerHTML = `${table.toLowerCase()}?${pk}={${pk}}`
    // GET all
    $('#Convert-area-get-all').value = getGetAll(table, arrColums)
    $('#uri-all').innerHTML = `${table.toLowerCase()}?pagina={page}`
    // POST
    $('#Convert-area-post').value = getPost(table, arrColums)
    $('#uri-post').innerHTML = `${table.toLowerCase()}`

    window.scrollTo(0,570)
}
// JSON
function getJson(table, arr){
    let change = []
    arr.map(item=>{
        if(item.value != '')
            change.push(`'${item.value.trim().toUpperCase()}' VALUE ${table}_${item.value.trim().toUpperCase()}`)
    })
    return `JSON_OBJECT(\n${change.join(',\n')}\nFORMAT JSON)`
}
// ALIASING
function getAliasing(table, arr){
    let change = []
    arr.map(item=>{
        if(item.value != '')
            change.push(`${table}.${item.value.trim().toUpperCase()} as ${table}_${item.value.trim().toUpperCase()}`)
    })
    return `-- tabela ${table}\n` + change.join(',\n')
}
// GET ONE
function getGetOne(table, arr, pk){
    let change = []
    arr.map(item=>{
        change.push(`${table}.${item.value.trim().toUpperCase()} as ${table}_${item.value.trim().toUpperCase()}`)
    })
    return `declare
    auth_key varchar2(100) := '!@#!@#';
    retorno clob;
    begin
    if (:auth = auth_key) then
    SELECT 
    ${getJson(table, arr)}
    INTO retorno
    FROM (
        SELECT ROWNUM as RN,
${getAliasing(table, arr)}
        FROM ${table} 
        )
    where ${table}_${pk} = :${pk};
    apex_json.parse(retorno);
    -- Retorna o JSON 
    htp.p('{ "${table}":'||retorno||'}');
    else
    htp.p('{"status":401,"error":"unauthorized"}');
    end if;
    end;`
}
// GET ALL
function getGetAll(table, arr){
    let change = []
    arr.map(item=>{
        change.push(`${table}.${item.value.trim().toUpperCase()} as ${table}_${item.value.trim().toUpperCase()}`)
    })
    return `declare
    auth_key varchar2(100) := '!@#!@#';
    v_row clob;
    v_table clob;
    num_rows number;
    pagination number := 15;
    loop_limit number;
begin
    
    if (:auth = auth_key) then
    -- pega quantas rows tem na tabela
    select count(*) into num_rows from ${table};
    -- Nao deixa o loop passar da ultima row
    if ((:page * pagination)<num_rows)then
    loop_limit := :page * pagination;
    else
    loop_limit := num_rows;
    end if;
    for i in (:page * pagination - 14)..loop_limit
    loop
    SELECT 
${getJson(table, arr)}
      INTO v_row
      FROM (SELECT ROWNUM as RN, 
${getAliasing(table, arr)}  
        FROM ${table}) where RN = i;
      v_table := v_table || v_row || ',';
      end loop;
      -- Remove o ultimo caracter
      select substr(v_table,1,length(v_table)-1)
      into v_table
      from dual;
      apex_json.parse(v_table);
     -- Retorna o JSON 
      htp.p('{ "${table}":['||v_table||']}');
      else
      htp.p('{"status":401,"error":"unauthorized"}');
      end if;
end;`
}
function getPost(table, arr){
    let change = []
    arr.map(item=>{
        if(item.value != '')
            change.push(`${item.value.trim().toUpperCase()}`)
    })
    return`BEGIN
    INSERT INTO ${table}(${change.join(',')}) VALUES(${change.map(x=>':'+x).join(',')});
htp.p('{"msg":"salvo"}');
END;`
}

//  Retorna um Array com os valores dos inputs de coluna
function getInputColumsValuesArray(){
    let inputsArray = Array.prototype.slice.call(document.getElementsByClassName('colum'))
    return inputsArray.map(x=>x.value.trim().toUpperCase()).filter(x=>x != '')
}
// Cria cria options com os valores do inputs de coluna
function setSelectPrimaryKey(){
    let selectPrimaryKey = document.getElementById('primary-key')
    selectPrimaryKey.innerHTML = ''
    
    let optionIndex = document.createElement('option')
    optionIndex.innerHTML = '-- Primary Key --'
    optionIndex.setAttribute('value','')
    selectPrimaryKey.appendChild(optionIndex)

    let options = getInputColumsValuesArray()
    options.map(value => {
        option = document.createElement('option')
        option.setAttribute('value',value)
        option.innerHTML = value
        selectPrimaryKey.appendChild(option)
    })
}
// Retorna o valor da primary key selecionada
function getSelectPrimaryKey(){
    let selectPrimaryKey = document.getElementById('primary-key')
    return selectPrimaryKey.options[selectPrimaryKey.selectedIndex].value.toLowerCase()
} 