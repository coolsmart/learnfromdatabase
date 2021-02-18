
document.getElementById("kaydet").addEventListener("click", kaydet);

function kaydet(){ 
	var datetime=firebase.firestore.Timestamp.now();
  	db.collection("vocabulary").add({
		kelime:document.getElementById("kelime").value,
  		anlam:document.getElementById("anlam").value,
  		cumle:document.getElementById("cumle").value,
   		date:datetime 
  	});
	alert("Saved!");
}

function sozluk(kelime){
	window.open("https://tr.langenscheidt.com/almanca-turkce/"+kelime);
}