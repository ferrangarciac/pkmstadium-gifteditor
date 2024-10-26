// Variables globales
let byteArray = null;
let rangoExtraido = null;
let bytesInvertidos = null; // Array invertido global

const lang_ES = [
	"EO: ",								//00
	"ID: ",								//01
	"Nivel: ",							//02
	"Objeto: ",							//03	
	"Movimientos: ",					//04
	"Placaje",							//05
	"Gruñido",							//06
	"ESTADIO",							//07
	"Caja Normal",						//08
	"Caja Grande",						//09
];
lang_EN = [
	"OT: ",								//00
	"ID: ",								//01
	"Level: ",							//02
	"Hold Item: ",						//03	
	"Moves: ",							//04
	"Tackle",							//05
	"Growl",							//06
	"Stadium",							//07
	"Normal Box",						//08
	"Gorgerous Box",					//09
];

var language = lang_ES;

const pokeNames = [
	"None",
	"Bulbasaur",
	"Ivysaur",
	"Venusaur",
	"Charmander",
	"Charmeleon",
	"Charizard",
	"Squirtle",
	"Wartortle",
	"Blastoise",
	"Caterpie",
	"Metapod",
	"Butterfree",
	"Weedle",
	"Kakuna",
	"Beedrill",
	"Pidgey",
	"Pidgeotto",
	"Pidgeot",
	"Rattata",
	"Raticate",
	"Spearow",
	"Fearow",
	"Ekans",
	"Arbok",
	"Pikachu",
	"Raichu",
	"Sandshrew",
	"Sandslash",
	"Nidoran♀",
	"Nidorina",
	"Nidoqueen",
	"Nidoran♂",
	"Nidorino",
	"Nidoking",
	"Clefairy",
	"Clefable",
	"Vulpix",
	"Ninetales",
	"Jigglypuff",
	"Wigglytuff",
	"Zubat",
	"Golbat",
	"Oddish",
	"Gloom",
	"Vileplume",
	"Paras",
	"Parasect",
	"Venonat",
	"Venomoth",
	"Diglett",
	"Dugtrio",
	"Meowth",
	"Persian",
	"Psyduck",
	"Golduck",
	"Mankey",
	"Primeape",
	"Growlithe",
	"Arcanine",
	"Poliwag",
	"Poliwhirl",
	"Poliwrath",
	"Abra",
	"Kadabra",
	"Alakazam",
	"Machop",
	"Machoke",
	"Machamp",
	"Bellsprout",
	"Weepinbell",
	"Victreebel",
	"Tentacool",
	"Tentacruel",
	"Geodude",
	"Graveler",
	"Golem",
	"Ponyta",
	"Rapidash",
	"Slowpoke",
	"Slowbro",
	"Magnemite",
	"Magneton",
	"Farfetch'd",
	"Doduo",
	"Dodrio",
	"Seel",
	"Dewgong",
	"Grimer",
	"Muk",
	"Shellder",
	"Cloyster",
	"Gastly",
	"Haunter",
	"Gengar",
	"Onix",
	"Drowzee",
	"Hypno",
	"Krabby",
	"Kingler",
	"Voltorb",
	"Electrode",
	"Exeggcute",
	"Exeggutor",
	"Cubone",
	"Marowak",
	"Hitmonlee",
	"Hitmonchan",
	"Lickitung",
	"Koffing",
	"Weezing",
	"Rhyhorn",
	"Rhydon",
	"Chansey",
	"Tangela",
	"Kangaskhan",
	"Horsea",
	"Seadra",
	"Goldeen",
	"Seaking",
	"Staryu",
	"Starmie",
	"Mr. Mime",
	"Scyther",
	"Jynx",
	"Electabuzz",
	"Magmar",
	"Pinsir",
	"Tauros",
	"Magikarp",
	"Gyarados",
	"Lapras",
	"Ditto",
	"Eevee",
	"Vaporeon",
	"Jolteon",
	"Flareon",
	"Porygon",
	"Omanyte",
	"Omastar",
	"Kabuto",
	"Kabutops",
	"Aerodactyl",
	"Snorlax",
	"Articuno",
	"Zapdos",
	"Moltres",
	"Dratini",
	"Dragonair",
	"Dragonite",
	"Mewtwo",
	"Mew",
];

function extraerRango(byteArray, inicio, fin) {
    if (inicio < 0 || fin >= byteArray.length || inicio > fin) {
        console.error('Índices fuera de rango');
        return [];
    }
    const rango = byteArray.subarray(inicio, fin + 1);
    return Array.from(rango); // Convertir a array normal si lo necesitas
}

// Función para invertir el array en bloques de 4 bytes
function invertirEnBloquesDeCuatro(array) {
    const resultado = [];
    for (let i = 0; i < array.length; i += 4) {
        const bloque = array.slice(i, i + 4).reverse();
        resultado.push(...bloque);
    }
    return resultado;
}

// Función para restaurar el array al estado original (deshacer inversión en bloques de 4)
function deshacerInversionEnBloquesDeCuatro(array) {
    return invertirEnBloquesDeCuatro(array); // Re-invertir bloques de 4 vuelve al estado original
}

// Función para calcular el checksum de 8 bits y asignarlo al último byte
function calcularYAsignarChecksum8bit(array) {
    const longitud = array.length - 2;
    let suma = 0;
    for (let i = 0; i < longitud; i++) {
        suma += array[i];
    }
    const checksum = suma & 0xFF;
    array[array.length - 1] = checksum; // Asignar el checksum al último byte
    return checksum;
}

// Función para reemplazar el array restaurado en el archivo original en su posición original
function reemplazarRangoEnArchivo(byteArray, inicio, arrayRestaurado) {
    for (let i = 0; i < arrayRestaurado.length; i++) {
        byteArray[inicio + i] = arrayRestaurado[i];
    }
}

// Función para convertir un array de bytes en formato hexadecimal
function arrayToHexString(array) {
    return array.map(byte => byte.toString(16).padStart(2, '0')).join(' ');
}

// Función para guardar el archivo modificado
function guardarArchivoModificado(byteArray, nombreArchivo = 'archivo_modificado.bin') {
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url); // Liberar el objeto URL
}

//Función para rellenar el select con los nombre de los pokémon y modificar el byte al cambiar
function fillSelect(){
	// Referencia al select en el HTML
    var selectElement = document.getElementById('pokemonList');
	
	for(i=0;i<pokeNames.length;i++){
		const optionElement = document.createElement('option');
		optionElement.value = i;
        optionElement.textContent = pokeNames[i];
        selectElement.appendChild(optionElement);
	}
}

//Función para rellenar los datos del pokemon regalo
function fillPkmData(){
	//Colocar sprite
	var imgDiv = document.getElementById('imgDiv');
	
	imgDiv.innerHTML = "";
	
	var sprite = document.createElement('img');
	sprite.src = "img/sprites/" + bytesInvertidos[29] + ".png";
	imgDiv.appendChild(sprite);
		
	var selectElement = document.getElementById('pokemonList');
	var pkmName = document.createElement('span');
	pkmName.innerHTML = pokeNames[selectElement.selectedIndex]
	imgDiv.appendChild(pkmName);
	
	//Rellenar datos
	var stats = document.getElementById('stats');
	
	stats.innerHTML = "";
	
	var ot = document.createElement('span');
	ot.innerHTML = language[0] + language[7];
	stats.appendChild(ot);
	
	var id = document.createElement('span');
	id.innerHTML = language[1] + "02000";
	stats.appendChild(id);
	
	var level = document.createElement('span');
	level.innerHTML = language[2] + "5";
	stats.appendChild(level);
	
	var box = 8;
	if(gorgerous.checked){
		box = 9;
	}
	var itemHeader = document.createElement('span');
	itemHeader.className = "col-header";
	itemHeader.innerHTML =language[3];
	stats.appendChild(itemHeader);
	
	var item = document.createElement('span');
	item.innerHTML =language[box];
	stats.appendChild(item);
	
	//Rellenar movimientos
	var moves = document.getElementById('moves');
	
	moves.innerHTML = "";
	
	var movesHeader = document.createElement('span');
	movesHeader.className = "col-header";
	movesHeader.innerHTML = language[4];
	moves.appendChild(movesHeader);
	
	var move1 = document.createElement('span');
	move1.innerHTML = language[5];
	moves.appendChild(move1);
	
	var move2 = document.createElement('span');
	move2.innerHTML = language[6];
	moves.appendChild(move2);
}

window.addEventListener('load', function() {
	
	fillSelect();

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const arrayBuffer = e.target.result;
                byteArray = new Uint8Array(arrayBuffer);
                console.log('Array de bytes completo en hexadecimal:', arrayToHexString(byteArray));

                // Extraer el rango de bytes
                rangoExtraido = extraerRango(byteArray, 0x9EA0, 0x9EC7);
                console.log('Array extraído en hexadecimal:', arrayToHexString(rangoExtraido));

                // Invertir los bytes en bloques de 4
                bytesInvertidos = invertirEnBloquesDeCuatro(rangoExtraido);
                console.log('Array invertido en bloques de 4 en hexadecimal:', arrayToHexString(bytesInvertidos));
				
				//Verificar si el pokemon de la partida original ya tiene la gorgerous box y si es así marcar la casilla
				var gorgerous = document.getElementById('gorgerous');
				if(bytesInvertidos[28] == 1){
					gorgerous.checked = true;
				}else{
					gorgerous.checked = false;
				}
				
				//Ver que pokémon hay de regalo en la partida y ponerlo en el select
                var selectElement = document.getElementById('pokemonList');
				selectElement.selectedIndex  = bytesInvertidos[29];
				
				fillPkmData();
            };

            reader.readAsArrayBuffer(file);
        }
    });
	
	// Agregar un event listener al select para detectar cambios
	var selectElement = document.getElementById('pokemonList');
    selectElement.addEventListener('change', function() {	
		// Actualizar bytesInvertidos[29] con el valor seleccionado
		bytesInvertidos[29] = parseInt(selectElement.value);
		
		//Renovamos datos pokemon
		fillPkmData();
	});
	
	// Renovamos info del pokemon si cambia la casilla de la caja
	var gorgerous = document.getElementById('gorgerous');
    gorgerous.addEventListener('change', function() {	
		//Renovamos datos pokemon
		fillPkmData();
	});
	
	document.getElementById('saveFileBtn').addEventListener('click', function() {
        //Verificar si la casilla de gorgerous box está marcada (si es así modificar el byte correspondiente)
		if(gorgerous.checked){
			bytesInvertidos[28] = 1;
		}else{
			bytesInvertidos[28] = 0;
		}
		
		// Calcular y asignar el checksum en el último byte del invertido
        const checksum = calcularYAsignarChecksum8bit(bytesInvertidos);
        //console.log('Checksum de 8 bits:', checksum.toString(16).padStart(2, '0'));
        //console.log('Array invertido con checksum en el último byte:', arrayToHexString(bytesInvertidos));
		
        // Restaurar el array invertido a su estado original
        const arrayRestaurado = deshacerInversionEnBloquesDeCuatro(bytesInvertidos);
        //console.log('Array restaurado en hexadecimal:', arrayToHexString(arrayRestaurado));
		
        // Reemplazar el rango restaurado en el archivo original
        reemplazarRangoEnArchivo(byteArray, 0x9EA0, arrayRestaurado);
        //console.log('Archivo original modificado:', arrayToHexString(byteArray));
		
        // Guardar el archivo modificado
        guardarArchivoModificado(byteArray);
    });
	
	
});
