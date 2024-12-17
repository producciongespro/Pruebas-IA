import detect from "./detect";

function detect_faces() {
  var photo = document.getElementsByName("photo")[0].files[0];

  detect(photo, (result) => {
    document.getElementById("detect-result")["style"]["display"] = "block";
    console.log(result);
    let genero
    const edad =  result[0].age

    if (result[0].gender.value === "Male"    ) {
      genero = "Masculino"
    } else if (result[0].gender.value === "Female") {
      genero = "Femenino"      
    } else {genero  = "desconocido" }
    
    document.getElementById("spnGenero").innerText = genero;
    document.getElementById("spnEdad").innerText = edad;
  });
}

function setup() {
  document.getElementById("inputFoto").addEventListener("change", detect_faces);
}

onload = () => setup();
