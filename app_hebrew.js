const field_input = document.getElementById("field_input");
const field_output = document.getElementById("field_output");
const btn_convert = document.getElementById("btn_convert");
const btn_copy = document.getElementById("btn_copy");
const select_from_encoding = document.getElementById("select_from_encoding");
const select_to_encoding = document.getElementById("select_to_encoding");

const swap_keys_and_values = function(dictObj){
	var res = {};
	for(var k in dictObj){
		res[dictObj[k]] = k;
	}
	return res;
}

const transliterationTableHEBtoISO = {
"א":"ʾ",
"ב":"b",
"בּ":"ḃ",
"ג":"g",
"ד":"d",
"ה":"h",
"הּ":"ḣ",
"ו":"w",
"ז":"z",
"ח":"ḥ",
"ט":"ṭ",
"י":"y",
"כ":"k",
"ך":"k",
"כּ":"k̇",
"ךּ":"k̇",
"ל":"l",
"מ":"m",
"ם":"m",
"נ":"n",
"ן":"n",
"ס":"s",
"ע":"ʿ",
"פ":"p",
"ף":"p",
"פּ":"ṗ",
"ףּ":"ṗ",
"צ":"ṣ",
"ץ":"ṣ",
"ק":"q",
"ר":"r",
"ש":"s̀",
"שׂ":"ś",
"שׁ":"š",
"ת":"t",
"׳":"'",
"\u05b7":"a",
"\u05b8":"a",
"\u05b5":"e",
"\u05b6":"e",
"\u05b4":"i",
"\u05b9":"o",
"\ufb4b":"ŵ",
"\u05bb":"u",
"\ufb35":"ẇ",
"\u05b0":"",
"\u05b2":"a",
"\u05b3":"o",
"\u05c7":"o",
"\u05b1":"e"
};

//const transliterationTableISOtoHEB = swap_keys_and_values(transliterationTableHEBtoISO); // TODO schreiben statt methode
const transliterationTableISOtoHEB = {
"ʾ":"א",
"b":"ב",
"ḃ":"בּ",
"g":"ג",
"d":"ד",
"h":"ה",
"ḣ":"הּ",
"w":"ו",
"z":"ז",
"ḥ":"ח",
"ṭ":"ט",
"y":"י",
"k":"כ",
"l":"ל",
"m":"מ",
"n":"נ",
"s":"ס",
"ʿ":"ע",
"p":"פ",
"ṗ":"פּ",
"ṗ":"ףּ",
"ṣ":"צ",
"ṣ":"ץ",
"q":"ק",
"r":"ר",
"s̀":"ש",
"ś":"שׂ",
"š":"שׁ",
"t":"ת",
"'":"׳",
"a":"\u05b7",
"e":"\u05b5",
"i":"\u05b4",
"o":"\u05b9",
"ŵ":"\ufb4b",
"u":"\u05bb",
"ẇ":"\ufb35",
"o":"\u05b3",
};


const convertToHebrew = function(input_txt, from_encoding){
	switch(from_encoding){
		case "ISO":
			var output_text = [];
			for (const idx in input_txt){
				const ch_ISO = input_txt[idx];
				const ch_HEB = transliterationTableISOtoHEB[ch_ISO] || ch_ISO;
				output_text.push(ch_HEB);
			}
			return output_text.join("");
			break;
		case "HEB":
			return input_txt;
			break;
	}
	return input_txt; // fail safe
}

const convertFromHebrew = function(input_txt, to_encoding){
	switch(to_encoding){
		case "ISO":
			var output_text = [];
			for (const idx in input_txt){
				const ch_HEB = input_txt[idx];
				const ch_ISO = transliterationTableHEBtoISO[ch_HEB] || ch_HEB;
				output_text.push(ch_ISO);
			}
			return output_text.join("");
			break;
		case "HEB":
			return input_txt;
			break;
	}
	return input_txt; // fail safe
}

const convert = function(input_txt, from_encoding, to_encoding){
	input_txt = convertToHebrew(input_txt, from_encoding);
	input_txt = convertFromHebrew(input_txt, to_encoding);
	return input_txt;
}


btn_convert.addEventListener('click', function(){
	var from_encoding = select_from_encoding.value;
	var to_encoding = select_to_encoding.value;
	
	field_output.value = convert(field_input.value, from_encoding, to_encoding);
})

btn_copy.addEventListener('click', function(){
	var copiedText = field_output.value;
	navigator.clipboard.writeText(copiedText);
	btn_copy.value = "Copied!";
	setTimeout(function(){
		btn_copy.value = "Copy to Clipboard";
	}, 1000);
})

field_input.addEventListener("keypress", function(event){
	if (event.key == "Enter"){
		btn_convert.click();
	}
})
