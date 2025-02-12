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

const transliterationTableARBtoBWT = {"\u0627": "A", "\u0628": "b", "\u062a": "t", "\u062b": "v", "\u062c": "j", "\u062d": "H", "\u062e": "x", "\u062f": "d", "\u0630": "*", "\u0631": "r", "\u0632": "z", "\u0633": "s", "\u0634": "$", "\u0635": "S", "\u0636": "D", "\u0637": "T", "\u0638": "Z", "\u0639": "E", "\u063a": "g", "\u0641": "f", "\u0642": "q", "\u0643": "k", "\u0644": "l", "\u0645": "m", "\u0646": "n", "\u0647": "h", "\u0648": "w", "\u064a": "y", "\u06cc": "Y", "\u0621": "'", "\u0623": ">", "\u0625": "<", "\u0624": "&", "\u0626": "}", "\u0622": "|", "\u0671": "{", "\u0670": "`", "\u064e": "a", "\u064f": "u", "\u0650": "i", "\u064b": "F", "\u064c": "N", "\u064d": "K", "\u0651": "~", "\u0652": "o", "\u0629": "p", "\u0640": "_"};

const transliterationTableBWTtoARB = swap_keys_and_values(transliterationTableARBtoBWT);

const transliterationTableBWTtoDMG = {"A": "ā", "b": "b", "t": "t", "v": "ṯ", "j": "ǧ", "H": "ḥ", "x": "ḫ", "d": "d", "*": "ḏ", "r": "r", "z": "z", "s": "s", "$": "š", "S": "ṣ", "D": "ḍ", "T": "ṭ", "Z": "ẓ", "E": "ʿ", "g": "ġ", "f": "f", "q": "q", "k": "k", "l": "l", "m": "m", "n": "n", "h": "h", "w": "w", "y": "y", "Y": "ā", "'": "ʾ", ">": "ʾa", "<": "ʾi", "&": "ʾu", "}": "īʾ", "|": "ʾā", "{": "a", "`": "ā", "a": "a", "u": "u", "i": "i", "F": "an", "N": "un", "K": "in", "~": "~", "o": "", "p": "a", "_": "_"};

const transliterationTableDMGtoBWT = {"ā": "A", "b": "b", "t": "t", "ṯ":"v", "ǧ":"j", "ḥ":"H", "ḫ":"x", "d":"d", "ḏ":"*", "r": "r", "z": "z", "s": "s", "š":"$", "ṣ":"S", "ḍ":"D", "ṭ":"Ṭ", "ẓ":"Ẓ", "ʿ":"E", "ġ":"g", "f":"f", "q": "q", "k": "k", "l": "l", "m": "m", "n": "n", "h": "h", "w":"w", "ū":"w", "y":"y", "ī":"y", "a":"a", "i":"i", "u":"u", "ʾ":"'"}

const transliterationTableBWTtoEIS = {"A": "ā", "b": "b", "t": "t", "v": "th", "j": "dj", "H": "ḥ", "x": "kh", "d": "d", "*": "dh", "r": "r", "z": "z", "s": "s", "$": "sh", "S": "ṣ", "D": "ḍ", "T": "ṭ", "Z": "ẓ", "E": "ʿ", "g": "gh", "f": "f", "q": "ḳ", "k": "k", "l": "l", "m": "m", "n": "n", "h": "h", "w": "w", "y": "y", "Y": "ā", "'": "ʾ", ">": "ʾa", "<": "ʾi", "&": "ʾu", "}": "īʾ", "|": "ʾā", "{": "a", "`": "ā", "a": "a", "u": "u", "i": "i", "F": "an", "N": "un", "K": "in", "~": "~", "o": "", "p": "a", "_": "_"};


const convertToBuckwalter = function(input_txt, from_encoding){
	switch(from_encoding){
		case "ARB":
			var output_text = [];
			for (const idx in input_txt){
				const ch_AR = input_txt[idx];
				const ch_BW = transliterationTableARBtoBWT[ch_AR] || ch_AR;
				output_text.push(ch_BW);
			}
			return output_text.join("");
			break;
		case "DMG":
			input_txt = input_txt.toLowerCase();
			var output_text = [""];
			for (const idx in input_txt){
				var ch = input_txt[idx];
				var prev_char = output_text.at(-1);
				if(ch == "-"){ // case: make as-sawt to Alsawt
					output_text.pop() // pop letter before hyphen
					output_text.push("l"); // push l instead and dont push hyphen
				}
				else if (ch == prev_char){
					output_text.push("~");
				}
				else{
					output_text.push(transliterationTableDMGtoBWT[ch] || ch);
				}
			}
			return output_text.join("");
			break;
		case "BWT":
			return input_txt;
			break;
		case "EIS":
			input_txt = input_txt.toLowerCase();
			var output_text = [""];
			for (const idx in input_txt){
				var ch = input_txt[idx];
				var prev_char = output_text.at(-1);
				if(ch == "-"){
					output_text.pop() // pop letter before hyphen
					output_text.push("l");
				}
				else if (ch == prev_char){
					output_text.push("~");
				}
				else if (ch == "j" & prev_char == "d"){
					output_text.pop() // pop "d" in "dj"
					output_text.push("j")
				}
				else if(ch == "h" & (prev_char == "t" | prev_char == "k" | prev_char == "d" | prev_char == "s" | prev_char == "g")){
					// cases: th, kh, dh, sh, gh
					output_text.pop()
					var new_char = {"t":"v", "k":"x", "d":"*", "s":"$", "g":"g"}[prev_char]
					output_text.push(new_char)
				}
				else{
					output_text.push(transliterationTableDMGtoBWT[ch] || ch);
				}
			}
			return output_text.join("");
			break;
	}
	return input_txt; // fail safe
}

const convertFromBuckwalter = function(input_txt, to_encoding){
	input_txt = input_txt.replaceAll("al~Ah", "Allh");
	switch(to_encoding){
		case "ARB":
			var output_text = [];
			for (const idx in input_txt){
				const ch_BW = input_txt[idx]
				const ch_AR = transliterationTableBWTtoARB[ch_BW] || ch_BW;
				if ((ch_BW == "a" | ch_BW == "i" | ch_BW == "u") & (input_txt[idx-1] == " " | idx == 0)){ // case: word onset with a/i/u
					output_text.push("\u0627"); // push alef
					output_text.push(ch_AR) // push fatha/damma/kasra
				}
				else if (ch_BW == "'" & (input_txt[idx-1] == " " | idx == 0)){ // case: word onset with lone hamza (fragment from DMG)
					output_text.push("\u0623") // push alef with hamza
				}
				else{
					output_text.push(ch_AR);
				}
			}
			return output_text.join("");
			break;
		case "DMG":
			input_txt = input_txt.replaceAll("o", "");
			var output_text = [""];
			for (const idx in input_txt){
				var ch = input_txt[idx];
				var prev_char = output_text.at(-1);
				if(ch == "~"){
					output_text.push(prev_char);
				}
				else if (ch == "l" & prev_char == "ā"){
					output_text.pop() // pop "ā"
					output_text.push("al-")
				}
				else{
					output_text.push(transliterationTableBWTtoDMG[ch] || ch);
				}
			}
			return output_text.join("").replaceAll("al-lh", "allāh");
			break;
		case "BWT":
			return input_txt;
			break;
		case "EIS":
			input_txt = input_txt.replaceAll("o", "");
			var output_text = [""];
			for (const idx in input_txt){
				var ch = input_txt[idx];
				var prev_char = output_text.at(-1);
				if(ch == "~"){
					output_text.push(prev_char);
				}
				else if (ch == "l" & prev_char == "ā"){
					output_text.pop() // pop "ā"
					output_text.push("al-")
				}
				else{
					output_text.push(transliterationTableBWTtoEIS[ch] || ch);
				}
			}
			return output_text.join("").replaceAll("al-lh", "allāh");
			break;
	}
	return input_txt; // fail safe
}

const convert = function(input_txt, from_encoding, to_encoding){
	input_txt = convertToBuckwalter(input_txt, from_encoding);
	input_txt = convertFromBuckwalter(input_txt, to_encoding);
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
