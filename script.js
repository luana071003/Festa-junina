document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search__button');
    const searchInput = document.getElementById('search');
    const recipeArea = document.getElementById('main__section__recipe__area');
    const recipeSection = document.querySelector('.main__section__recipe');

  
    //HABILITANDO O BOTÃO DE PESQUISA COM O EVENTO DE CLICK
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        recipeSection.style.height = 'auto';
        getRecipes(searchTerm);
        searchInput.value = "";
    });

  
    //FUNÇÃO PARA FAZER A CONEXÃO COM O XML
    function getRecipes(searchTerm) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log('XML positivo e operante!'); 
                showRecipes(this.responseXML, searchTerm);
            }
        };
        xhttp.open('GET', 'receitas.xml', true); 
        xhttp.send();
    }

    //FUNÇÃO PARA MOSTRAR AS RECEITAS
    function showRecipes(xml, searchTerm) {
        if (!xml) {
            console.error('O XML está com preguiça de trabalhar.');
            return;
        }

        let recipes = xml.getElementsByTagName('receita');
        let output = '';
        let foundRecipe = false; 


        //PERCORRENDO AS RECEITAS E VERIFICANDO SEUS ELEMENTOS
        for (let i = 0; i < recipes.length; i++) {
            let recipeName = recipes[i].getElementsByTagName('nome')[0].textContent.toLowerCase();
            if (recipeName.includes(searchTerm)) {
                foundRecipe = true; 

              
                //TRABALHANDO COM OS INGREDIENTES
                let ingredientsList = recipes[i].getElementsByTagName('ingrediente');
                let ingredients = '<ol>';
                for (let j = 0; j < ingredientsList.length; j++) {
                    ingredients += '<li>' + ingredientsList[j].textContent + '</li>' + '<br>';
                }
                ingredients += '</ol>';


                //TRABALHANDO COM O MODO DE PREPARO
                let preparationSteps = recipes[i].getElementsByTagName('passo');
                let steps = '<ol>';
                for (let k = 0; k < preparationSteps.length; k++) {
                    steps += '<li>' + preparationSteps[k].textContent + '</li>' + '<br>';
                }
                steps += '</ol>';


                //TRABALHANDO COM O TEMPO DE PREPARO
                let cookingTime = recipes[i].getElementsByTagName('tempo_preparo')[0].textContent;

               let recipeImage = recipes[i].getElementsByTagName('imagem')[0].textContent;
              
            


                //PREPARANDO O MODO PELO QUAL OS DADOS SERÃO MOSTRADOS NA INTERFACE
              output += `
                  <div class="recipe">
                      <img src="${recipeImage}" alt="${recipeName}" class="recipe-image"> <br> <br> <h3>RECEITA: ${recipeName.toUpperCase()}</h3> <br> <br> 
                      <p><strong>INGREDIENTES:</strong></p>
                      ${ingredients}
                      <br><br><p><strong>MODO DE PREPARO:</strong></p>
                      ${steps} <br> <br>
                      <p><strong>TEMPO DE PREPARO:</strong> ${cookingTime}</p>
                  </div>
              `;
            }
        }

        //SE NÃO HOUVER NENHUMA RECEITA, APARECE A MENSAGEM "Receita não encontrada."
        if (!foundRecipe) {
            output = '<div class="recipe"><p>Receita não encontrada.</p></div>';
        }


        //ARRUMANDO A PARTE VISUAL DA SEÇÃO DA RECEITA
        console.log(output); 
        recipeArea.style.display = "block";
        recipeArea.style.height = "auto";
        recipeArea.style.backgroundColor = "#1d6030";
        recipeArea.innerHTML = output;
    }
});
