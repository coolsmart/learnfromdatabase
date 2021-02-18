var checkboxid=0; 
var kaldigimkelime="";


db.collection("vocabulary_count").doc("001").get().then(x=> { 
	var toplam=x.data().toplam;
	var ezberlenen=x.data().ezberlenen;
	kaldigimkelime=x.data().kaldigimkelime;
	document.getElementById("id_count").innerHTML= toplam; 
	document.getElementById("id_countezber").innerHTML=ezberlenen   
	document.getElementById("id_countdevam").innerHTML=toplam-ezberlenen;
});

async function sonrakikelimeleriyukle(){  
		ref=db.collection("vocabulary")
		.orderBy("kelime")
		.startAfter(kaldigimkelime||0)
		.limit(10) 
	
		mydata=await ref.get();  

		mydata.docs.forEach(y=>{
			checkboxid++; 
			ekranayazdir(y,checkboxid)
		});


		kaldigimkelime=mydata.docs[mydata.docs.length-1];

	}

document.getElementById("id_more").addEventListener("click", sonrakikelimeleriyukle);


function ekranayazdir(y,checkboxid){
	kelime=y.data().kelime;
	anlam=y.data().anlam;
	id=y.id; 
	ezberlendimi=y.data().ezberlendimi; 
	cumle=y.data().cumle;  


	var tableRef=document.getElementById("myTable");
	var row = tableRef.insertRow(-1); 
	var cell_kelime = row.insertCell(0);
	var cell_anlam = row.insertCell(1); 
	var cell_cumle = row.insertCell(2); 
	var cell_sozluk = row.insertCell(3); 
	var cell_checkbox = row.insertCell(4); 
	var cell_edit = row.insertCell(5); 
	var cell_delete = row.insertCell(6); 
	var cell_id = row.insertCell(7); 

	cell_kelime.innerHTML = kelime;
	cell_anlam.innerHTML = anlam;
	cell_delete.innerHTML = '<button id="delete_button" class="btn" onclick="veritabanindansil(\''+id+'\')"><i class="fa fa-trash-alt fa-sm"></i></button>';
	cell_edit.innerHTML = '<button id="edit_button" class="btn" onclick="guncelle(\''+id+'\')"><i class="fas fa-pencil-alt fa-sm"></i></button>'
	cell_cumle.innerHTML = '<button id="cumle_button" class="btn" onclick="cumlegoster(\''+id+'\')"><i class="far fa-file-alt"></i></button"></i></button>'
	cell_sozluk.innerHTML = '<button id="sozluk_button" class="btn" onclick="sozluk(\''+kelime+'\')"><i class="fas fa-book fa-sm"></i></button>'

	cell_kelime.id="id_kelimecell"
	cell_anlam.id="id_anlamcell"
	cell_delete.id="id_buttoncell"
	cell_edit.id="id_buttoncell"
	cell_cumle.id="id_cumlecell"
	cell_checkbox.id="id_checkboxcell"
	cell_sozluk.id="id_buttoncell"

	var checkbox = document.createElement('input');
       checkbox.type = "checkbox";
       checkbox.id = checkboxid;    
       cell_checkbox.appendChild(checkbox);

	   if (ezberlendimi=="evet"){
	 		cell_kelime.style.backgroundColor="#b3ffb3";
	 		document.getElementById(checkboxid).checked=true;
		}

	   if (cumle!=""){
	 		cell_cumle.style.backgroundColor="#ffcc80";
		}

	checkbox.addEventListener('change', function() {
	  id=cell_id.innerHTML; 
	  if (checkbox.checked) {
	    db.collection("vocabulary").doc(id).update({ezberlendimi:"evet"});
	    alert("Ezberlendi olarak kaydedildi.")
	  } else {
	    db.collection("vocabulary").doc(id).update({ezberlendimi:""});
	  }
	});

	cell_id.innerHTML = id;
	cell_id.style.display='none' 
}


function veritabanindansil(id){ 
if (confirm("Are you sure you want to delete the record? ",id)) {
  	db.collection("vocabulary").doc(id).delete();
  	alert("Deleted!");
  	}
}


function guncelle(id){
 
  		var guncellenecekkelime = document.createElement("INPUT");
  		var guncellenecekanlam = document.createElement("INPUT");
  		guncellenecekkelime.setAttribute("type", "text");
  		guncellenecekkelime.setAttribute("id", "id_guncellenecekkelime");
  		guncellenecekkelime.setAttribute("placeholder", "kelime");
  		guncellenecekanlam.setAttribute("type", "text");
  		guncellenecekanlam.setAttribute("id", "id_guncellenecekanlam");
  		guncellenecekanlam.setAttribute("placeholder", "anlam");
  		document.getElementById("bos_alan").appendChild(guncellenecekkelime);

  		var buton = document.createElement("BUTTON");
  		buton.innerHTML="Kaydet";
  		buton.setAttribute("id","id_buton");

  		document.getElementById("bos_alan").appendChild(guncellenecekanlam);
  		document.getElementById("bos_alan").appendChild(buton);
  		buton.addEventListener("click", guncelhalinikaydet);

		function guncelhalinikaydet(){

			yenikelime=document.getElementById("id_guncellenecekkelime").value;
   			yenianlam=document.getElementById("id_guncellenecekanlam").value;
   			if (yenikelime!=""){
   				db.collection("vocabulary").doc(id).update({kelime:yenikelime});
   				alert("Kelime güncellendi!");
   			}	
   			if (yenianlam!=""){
   				db.collection("vocabulary").doc(id).update({anlam:yenianlam});
   				alert("Anlam güncellendi!");
   			}	

   			document.getElementById("bos_alan").style.display="none";
		}
}

function cumlegoster(kelime_id){

	db.collection("vocabulary").doc(kelime_id).get().then((x) => {
	  if (x.data().cumle!=""){
		var cumlekutusu = document.getElementById("id_cumlekutusu");
		cumlekutusu.style.display = "block";
		var cumle=document.getElementById("id_cumle");
		cumle.innerHTML="<strong>"+x.data().kelime+"</strong>"+"<br>"+x.data().cumle;
		close=document.getElementById("close");
		close.addEventListener("click", kapat);

		function kapat(){
		    cumlekutusu.style.display = "none";
		}
	  }
	});
}

function sozluk(kelime){
	window.open("https://tr.langenscheidt.com/almanca-turkce/"+kelime);
}

function toplam(){
db.collection("vocabulary").get().then(function(x) { 
	toplam=x.size;	
	db.collection("vocabulary_count").doc("001").update({toplam:toplam});
	db.collection("vocabulary").where("ezberlendimi","==","evet").get().then(function(y) { 
		ezberlenen=y.size;	
		db.collection("vocabulary_count").doc("001").update({ezberlenen:ezberlenen});
	});
	alert("Güncellendi!")
});
}

function kaldigimkelimeyikaydet(){
	if (confirm("Kaldığınız kelime kaydedilsin mi?")) {
  		db.collection("vocabulary_count").doc("001").update({kaldigimkelime:kelime});
  		alert("Kaydedildi!");
  	}
}

window.addEventListener('DOMContentLoaded',()=>  setTimeout(function(){sonrakikelimeleriyukle()}, 300)); 