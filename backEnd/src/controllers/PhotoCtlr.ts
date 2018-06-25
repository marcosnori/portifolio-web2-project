import { photosModel, IUsuarioPhotos } from './../model/definitions/Photo';


const fs = require("fs");

class PhotoCtlr{

    static create(req, res, next) {
        var obj = req.body;    
        photosModel.create(obj, (err, data) => {
          if (err) next(err);
          else res.json(data);
        });
      }
      static putPhotos(req, res, next) {
        var obj = req.body;
        var nomeAlbum = obj.nome;
        var nomePhoto = obj.namePhoto;
        var userId = obj.userID;
        var photoname = [];
        if(!fs.existsSync("./bin/assets/"+userId))
        {
          fs.mkdirSync("./bin/assets/"+userId);
        }
        fs.mkdirSync("./bin/assets/"+userId+"/" + nomeAlbum + "/");

        if (obj.photo) {
          
        for (let i = 0; i < nomePhoto.length; i++) {
            var base64Data = obj.photo[i].replace(/^data:image\/[a-z]+;base64,/, "");
            photoname.push("assets/" + userId  +"/"+ nomeAlbum + "/" + nomePhoto[i] + ".png");            
            fs.writeFile("./bin/assets/" + userId  +"/"+ nomeAlbum + "/" + nomePhoto[i] + ".png", base64Data, 'base64', function (err) {
                if (err)
                    console.log("err = " + err);
                  });
        }
        obj.namePhotos = photoname;
      }
        photosModel.create(obj, (err, data) => {
          if (err) next(err);
          else res.json(data);
        });
    }
    static buscarAlbuns(req, res, next)
    {
      var obj = req.params.id;
      PhotoCtlr.getByIdUser(obj).then(
        data => {
          res.json(data);
        },
        err => {
          next(err);
        }
      );
    }
    static buscarAlbum(req, res, next)
    {
      var obj = req.params.id;
      PhotoCtlr.getById(obj).then(
        data => {
          res.json(data);
        },
        err => {
          next(err);
        }
      );
    }
    private static getById(id) {
      return new Promise<IUsuarioPhotos>((resolve, reject) => {
        photosModel.findOne({ isDeleted: false, _id: id }, (err, data) => {
          if (err || data === null) reject(err);
          else {
            resolve(data);
          }
        });
      });
    }
    
    private static getByIdUser(id) {
      return new Promise<IUsuarioPhotos>((resolve, reject) => {
        photosModel.find({ isDeleted: false, userID: id }, (err, data) => {
          if (err || data === null) reject(err);
          else {
            resolve(data);
          }
        });
      });
    }
}
export default PhotoCtlr;



