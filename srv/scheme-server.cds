using { meli.aitest.db as db } from '../db/schema';

service Services {
   // entity summary as projection on db.Document excluding {files};
    function testAI(campo: String)  returns String;
    function getSummary(company_code: String, id_document: String, language_user: String) returns String;
    action uploadDocument(header: db.HeaderData, files: array of db.FileData )       returns String;

}