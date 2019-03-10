const multer = require('multer');
//multer configuration
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./upload');
    },
    filename: function(req,file,cb){
        // date = new Date().getUTCMilliseconds().toLocaleString();
        // min = new Date().getMinutes().toLocaleString();
        const newName = Date.now().toString()
        let ex = file.mimetype.replace("/",".")
        cb(null, newName + ex)
    }
});
const upload = multer({
    storage: storage
});

module.exports = upload