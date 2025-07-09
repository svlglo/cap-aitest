namespace meli.aitest.db;

using {cuid, managed} from '@sap/cds/common';

type FileData {
    documentType    :String;
    mimeType        :String;
    content         :LargeString;
    fileName        :String;
}

type HeaderData {
    idSap           :String;
    documentType    :TypeDoc;
    createdBy       :String;
    createdDate     :Date;
    companyCode     :String;
}

type TypeDoc    :String 
    enum {
            order;
            contract;
            financial;
        }

entity Document         :cuid, managed {
    idSap               : String;  
    summary             : LargeString;
    prompt              : LargeString;
    keyWords            : LargeString;
    trackingId          : UUID;
    companyCode         : String;
    langu               : String;
    documentType        : TypeDoc;
    files               : Association to many File  on files.document = $self;
}

entity File           :cuid, managed {
    idSap             :String;  
    document          :Association to Document;
    fileName          :String;
    mimeType          :String;
    summary           :LargeString;
    prompt            :LargeString;
    keyWords          :LargeString;
    logReport         :LargeString;
}