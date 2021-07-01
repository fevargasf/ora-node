const { jsPDF } = require("jspdf");
const logo = require("../logo");


function generateCover(files){

       //  --------------------------- pdf informacion estatica
       var cover = new jsPDF();
       //console.log('TODOS',files[0]);
       var viNomResponsable = "pruebas",
         viCorreoRespo = "camilo@hotmail.com",
         viTelRespoFijo = 1235468,
         viTelRespoCelu = 12354865237,
         municipio = "Cisneros",
         nombreObliga = "Vertimientos";
       let timeFecha = files[0][4];
       let time = files[0][4];
       let fecha = time.toISOString().substring(0, 10).split("-");
       let dia = fecha[2];
       let mes = fecha[1];
       let age = fecha[0];

       var pageWidth = 8.5,
         lineHeight = 1.2,
         margin = 0.5,
         margin1 = 1.0,
         maxLineWidth = pageWidth - margin * 2,
         fontSize = 12,
         ptsPerInch = 72,
         oneLineHeight = (fontSize * lineHeight) / ptsPerInch;

       cover.setFontSize(12);
       //doc.text("Consolidado de Autogestión de tramites Ambientales", 15, 9);
       cover.addImage(logo, "JPEG", 150, 2, 55, 20);

       var textLines = cover
         .setFont("times")
         .setFontSize(fontSize)
         .splitTextToSize(maxLineWidth);

       // doc.text can now add those lines easily; otherwise, it would have run text off the screen!

       cover.text(textLines, margin, margin + 2 * oneLineHeight);

       // You can also calculate the height of the text very simply:
       var textHeight =
         (textLines.length * fontSize * lineHeight) / ptsPerInch;

       cover
         .setFont("Helvetica", "bold")
         .text(
           " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             "Radicado No noSecDocCoe del " +
             `${dia}` +
             " " +
             " del mes " +
             `${mes}` +
             " " +
             " de " +
             `${age}` +
             " " +
             "\n" +
             " " +
             "\n" +
             "Nombre: " +
             `${viNomResponsable}` +
             " " +
             "\n" +
             "Email: " +
             `${viCorreoRespo}` +
             " " +
             "\n" +
             "Teléfono fijo:  " +
             `${viTelRespoFijo}` +
             " " +
             "\n" +
             "Teléfono celular:  " +
             `${viTelRespoCelu}` +
             " " +
             "\n" +
             "Expediente: " +
             `${files[0][1]}` +
             " " +
             "\n" +
             "Municipio:" +
             `${municipio}` +
             " " +
             "\n" +
             "Fecha de diligenciamiento: " +
             `${timeFecha}` +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n",
           15,
           9
         );

       cover
         .setFont("Helvetica")
         .text(
           " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             "Señores Corantioquia,\n " +
             "A continuación, se reporta el estado de las obligaciones cumplidas dentro del trámite del\n" +
             "expediente " +
             `${files[0][1]}` +
             " " +
             ".\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             "Obligaciones del usuario recovers por autogestión de control y seguimiento.\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             "Número de la resolución " +
             `${files[0][6]}` +
             " " +
             "\n" +
             " " +
             "\n" +
             "NOMBRE DE LA OBLIGACION:" +
             `${nombreObliga}` +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             "Descripción obligación \n" +
             " " +
             `${files[0][2]}` +
             " " +
             "\n" +
             " " +
             "\n" +
             "Descripción cumplimiento \n " +
             " " +
             `${files[0][3]}` +
             " " +
             "\n" +
             " " +
             "\n" +
             " ",
           15,
           9
         );

         let consolidado;
         files.forEach(file => {
             consolidado+=  "\n"+file[8] + "\n" 
         });
         cover
         .setFont("Helvetica")
         .text(
           " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             " " +
             "\n" +
             "\n" +
             "\n" +
             " " +
             "\n" +
             "\n" +
             " " +
             "\n" +
             "\n" +
             " " +
             "\n" +
             "\n" +
             " " +
             "Descripción anexos o evidencias\n " +
             " " +
             `${consolidado}` +
             " " +
             " ",
           20,
           50
         );

       /* let result = consi.filter((item,index)=>{
  return consi.indexOf(item) === index;
})
console.log(result[0]); */

       
      
         return cover;
}

module.exports = generateCover