using { meli.aitest.db as db } from '../db/schema';

service Servicios {

    //no sera necesario exponer el entity completo
    //entity resumen as projection on db.Documento excluding {files};

    function testAI(campo: String)  returns String;
    function obtenerResumen(id_sociedad: String, id_documento: String, idioma_user: String) returns String;
    action uploadDocument(header: db.HeaderData, files: array of db.FileData )       returns String;


}