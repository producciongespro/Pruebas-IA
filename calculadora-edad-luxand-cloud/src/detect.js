export default function detect(image, callback){
    var myHeaders = new Headers();
    myHeaders.append("token", import.meta.env.VITE_API_TOKEN );
  
    var formdata = new FormData();    
  
    if ((typeof image == "string") && (image.indexOf("https://") == 0))
        formdata.append("photo", image);
    else
        formdata.append("photo", image, "file");
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };
  
    fetch("https://api.luxand.cloud/photo/detect", requestOptions)
      .then(response => response.json())
      .then(result => callback(result))
      .catch(error => console.log('error', error)); 
  }