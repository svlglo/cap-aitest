import { v4 as uuidv4 } from 'uuid';

class Helper {
    constructor() {
      //cargar settings helpers
    }

     generateTrackingId() {
        return uuidv4();
    }



}

export default Helper;
