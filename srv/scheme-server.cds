using { meli.aitest.db as db } from '../db/schema';

service Servicios {

    //compartir la info de cada resumen
    entity resumen as projection on db.Documento excluding {files};

    function uploadDocumento(campo: String)  returns String;
    function obtenerResumen(id_sociedad: String, id_documento: String, idioma_user: String) returns String;


}