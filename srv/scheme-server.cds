using { meli.aitest.db as db } from '../db/schema';

service Servicios {

    //compartir la info de cada resumen
    entity resumen as projection on db.Documento excluding {files};

    function uploadDocumento(campo: String)  returns String;

}