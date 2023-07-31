/**
 * Desarrollado por Yarilenka Benites Mozo
 * Referencias: https://stackoverflow.com/a/26497772/2391195
 *             https://developers.google.com/apps-script/guides/html/communication#index.html_4
 */


var folderID = "1YegRjFNCOH4UKC8Y5wZBpUUKRlZCzNAZ"; //Replace the "root"with folder ID to upload files to a specific folder
var sheetName = "INGRESO_INVENTARIO";
var sheetMove = "BAJAS_INVENTARIO";

const BD_ID = '1oj4fCsHiHw7voG6v47k5zkiZozLsL4hRcEalTbIQ72I';
const SS = SpreadsheetApp.openById(BD_ID);
const sheetUsuarios = SS.getSheetByName(sheetName);
const sheetMover = SS.getSheetByName(sheetMove);

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate();
}

/* @Include JavaScript and CSS Files */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function uploadFiles(formObject) {
  try {
    var folder = DriveApp.getFolderById(folderID);
    var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
    var fileUrl = "";
    var fileName = "";

    //Upload file if exists and update the file url
    if (formObject.myFile.length > 0) {
      var blob = formObject.myFile;
      var file = folder.createFile(blob);
      file.setDescription("Uploaded by " + formObject.first_name);
      fileUrl = file.getUrl();
      fileName = file.getName();
    } else{
      fileName = "SIN NOMBRE";
      fileUrl = "SIN URL";
    }

    //Saving records to Google Sheet
    sheet.appendRow([
      crearId(),
      formObject.descripcion,
      formObject.tipo,
      formObject.cantidad,
      formObject.fecha,
      formObject.modelo,
      formObject.serie,
      formObject.numeroParte,
      formObject.almacen,
      formObject.ubicacion,
      fileName,
      fileUrl,
      formObject.comentario]);
    
    // Return the URL of the saved file
    return fileUrl;
    
  } catch (error) {
    return error.toString();
  }
}

function crearId() {
      let id = 999999;
      if(sheetUsuarios.getLastRow() === 1) {
        return id;
      }
      const ids = sheetUsuarios.getRange(2,1,sheetUsuarios.getLastRow()-1,1).getValues().map(id=>id[0]);
      let maxId = 999999;
      ids.forEach(id=>{
        if(id > maxId) {
          maxId = id;
        }
      });
      return maxId+1;
    }

  function readUsers() {
    const dataUsuarios = sheetUsuarios.getDataRange().getDisplayValues();
    dataUsuarios.shift();
    if(dataUsuarios.length === 0) {
      return "No hay registros para mostrar";
    }
    /*console.log(dataUsuarios);*/
    return dataUsuarios;
}

function editarUsuario (form) {
  const fila = buscarFila(form.codigodeinventario);
  console.log(form.codigodeinventario);
  sheetUsuarios.getRange(fila, 2, 1, sheetUsuarios.getLastColumn()-1-2).setValues([[
    form.descripcion,
    form.tipo,
    form.cantidad,
    form.fecha,
    form.modelo,
    form.serie,
    form.numeroParte,
    form.almacen,
    form.ubicacion
  ]])
  return 'Usuario Editado'
}

function buscarFila(codigodeinventario = '1000002') {
  const codigosdeinventario = sheetUsuarios.getRange(2, 1, sheetUsuarios.getLastRow()-1,1).getValues().map(codigodeinventario => codigodeinventario[0]);
  // console.log(codigosdeinventario);
  const index = codigosdeinventario.indexOf(Number(codigodeinventario));
  //console.log(index);
  const row = index + 2;
  return row;
}

function setearValores() {

}

function borrarUsuario(codigodeinventario) {
    const fila = buscarFila(codigodeinventario);
    console.log(fila);
    rowValues = sheetUsuarios.getRange(fila, 1, 1, sheetUsuarios.getLastColumn()-1).getValues()[0];
    
    codigodeinventarioT = rowValues[0];
    descripcionT = rowValues[1];
    tipoT = rowValues[2];
    cantidadT = rowValues[3];
    fechaT = rowValues[4];
    modeloT = rowValues[5];
    serieT = rowValues[6];
    numeroParteT = rowValues[7];
    almacenT = rowValues[8];
   
    ubicacionT = rowValues[9];

    console.log(fila);

    sheetMover.appendRow([
      
      codigodeinventarioT,
      descripcionT,
      tipoT,
      cantidadT,
      fechaT,
      modeloT,
      serieT,
      numeroParteT,
      almacenT,
      ubicacionT,
      new Date()
      ]);

    sheetUsuarios.deleteRow(fila); 
  }
