/**
 * Created by xionghua on 2017/4/17.
 */
var Model = function(){
    this.currentImage = null;
    this.images = [];
};

Model.prototype.init = function () {
    if (!localStorage.images) {
        this.images =  [
            {
                name:"2017-02-24",
                imgSrc:"image/2017-02-24_204108.jpg",
                countNum:0
            },
            {
                name:"2017-03-24",
                imgSrc:"image/2017-03-24_131246.jpg",
                countNum:0
            },
            {
                name:"2017-03-26",
                imgSrc:"image/2017-03-26_111149.jpg",
                countNum:0
            },
            {
                name:"2017-03-29",
                imgSrc:"image/2017-03-29_135830.jpg",
                countNum:0
            },
            {
                name:"2017-03-31",
                imgSrc:"image/2017-03-31_110047.jpg",
                countNum:0
            }
        ];
        localStorage.images = JSON.stringify(this.images);
    }  else {
        this.images =  JSON.parse(localStorage.images);
    }

    this.currentImage = model.images[0];
};

Model.prototype.update = function (image) {
    for (var i =0; i < this.images.length; i ++) {
        if (this.images[i] == this.currentImage) {
            this.images[i].name = image.name;
            this.images[i].imgSrc = image.imgSrc;
            this.images[i].countNum = image.countNum;
            break;
        }
    }
    localStorage.images = JSON.stringify(this.images);
};


var model = new Model();


var Octopus = function(){
};

Octopus.prototype.init = function(){
    model.init();
    imageList.init();
    imageView.init();
    adminView.init();
};
Octopus.prototype.updateImage = function(image) {
    model.update(image);
}
Octopus.prototype.getCurrentImage = function(){
  /** var listImages = document.getElementsByTagName("input");
    for (var i = 0;i<listImages.length;i++){
        var listImage = listImages[i];
        if(listImage.checked = checked){
            return  model.currentImage = listImage;
        }
    }
   **/
    return model.currentImage;
};

Octopus.prototype.getImages = function(){
    return model.images;
};

Octopus.prototype.setCurrentImage =function(image){
    model.currentImage = image;
};

Octopus.prototype.countIncrement = function(){
   model.currentImage.countNum++;
    imageView.render();
};

Octopus.prototype.adminClick = function(){
  var adminButton = document.getElementById("admin");
    adminButton.onclick = function(){
        adminView.render();
    }
};

var octopus = new Octopus();


var ImageList = function(){
    this.imageListElem = document.getElementById("imageList");
};

ImageList.prototype.init = function(){
    this.render();
};

ImageList.prototype.render = function(){
    this.imageListElem.innerHTML = "";
    var images = octopus.getImages();
    for(var i = 0;i<images.length;i++){
        var image = images[i];
        var imageName = image.name;
        var forEachInput = document.createElement("li");
        var elemLabel = document.createElement("label");
        var elemInput = document.createElement("input");
        forEachInput.innerHTML = "";
        forEachInput.setAttribute("class","eachInput");
        elemInput.setAttribute("type","radio");
        elemInput.setAttribute("id",imageName);
        elemInput.setAttribute("name","baby");
        elemLabel.setAttribute("for",imageName);
        elemLabel.textContent = imageName;
        forEachInput.appendChild(elemInput);
        forEachInput.appendChild(elemLabel);
       this.imageListElem.appendChild(forEachInput);
        elemInput.addEventListener('click',(function(imageCopy){
            return function() {
                octopus.setCurrentImage(imageCopy);
                imageView.render();
            };
        })(image))

    }
};

var imageList = new ImageList();


var ImageView = function(){
    this.babyElem = document.getElementById("baby");
    this.babyNameElem = document.getElementById("baby-name");
    this.babyImageElem = document.getElementById("baby-image");
    this.babyCountElem = document.getElementById("baby-count");
};

ImageView.prototype.init = function(){
    this.babyImageElem.addEventListener("click",function(){
        octopus.countIncrement();
    });
    this.render();
};

ImageView.prototype.render = function(){
    var currentImage = octopus.getCurrentImage();
    this.babyNameElem.textContent = currentImage.name;
    this.babyImageElem.src = currentImage.imgSrc;
    var ctx = this.babyCountElem.getContext("2d");
    ctx.clearRect(0,0,this.babyCountElem.width,this.babyCountElem.height);
    ctx.font = "40px Arial";
    ctx.fillText("点赞： "+currentImage.countNum, 50, 100);
};

var imageView = new ImageView();

var AdminView = function(){
    this.adminDiv = document.getElementById("admin");
    this.adminMessageDiv = document.createElement("div");
    this.adminDiv.appendChild(this.adminMessageDiv);

    this.nameMessage = this.createInputElement("Name", "nameMessage");
    this.urlMessage = this.createInputElement("ImageUrl", "urlMessage");
    this.clickMessage = this.createInputElement("Click", "clickMessage");
    this.adminMessageDiv.appendChild(this.nameMessage);
    this.adminMessageDiv.appendChild(this.urlMessage);
    this.adminMessageDiv.appendChild(this.clickMessage);

    this.cancelButton = this.createInputBtn("cancel");
    this.saveButton = this.createInputBtn("save");
    this.adminMessageDiv.appendChild(this.cancelButton);
    this.adminMessageDiv.appendChild(this.saveButton);
};

AdminView.prototype.createInputElement = function (hint, eleId) {
    var ele = document.createElement("div");
    ele.innerHTML = '<span class="input-hint">' + hint + ':</span>'  + '<input type="text" id = "' + eleId + '" />';
    ele.setAttribute("class", "input-line");
    return ele;
};

AdminView.prototype.createInputBtn = function (value) {
    var btn = document.createElement("input");
    btn.setAttribute("type","submit");
    btn.setAttribute("value",value);
    btn.setAttribute("class", "input-btn");
    return btn;
};

AdminView.prototype.init = function(){
    this.adminMessageDiv.style.display = "none";
    var adminBtn = document.getElementById("adminBtn");
    adminBtn.addEventListener("click",function(){
        adminView.render();
    });

    //TODO: set current image name/src/click
    this.saveButton.addEventListener("click", function(){
        var nameValue = $("#nameMessage").val();
        var urlValue = $("#urlMessage").val();
        var clickValue = $("#clickMessage").val();
        // var currentImage = octopus.getCurrentImage();
        // currentImage.name = nameValue;
        // currentImage.imgSrc = urlValue;
        // currentImage.countNum = clickValue;
        var image = {
            name: nameValue,
            imgSrc: urlValue,
            countNum: clickValue
        };
        octopus.updateImage(image);
        imageView.render();
        adminView. adminMessageDiv.style.display = "none";

      /**
        var image = {
           name: nameValue,
           imgSrc: urlValue,
           countNum: 0
       };
       var images = octopus.getImages();
        images.push(image);
**/
    });

    //TODO: do nothing to image, just reset input values
    this.cancelButton.addEventListener("click", function() {
        adminView.reset();
       adminView. adminMessageDiv.style.display = "none";
    });

};
AdminView.prototype.reset = function(){
    var allInputs = $("input[type='text']");
    for(var i = 0;i<allInputs.length;i++){
        allInputs[i].value="";
    }

};

AdminView.prototype.render = function(){

    this.adminMessageDiv.style.display = "block";
};

var adminView = new AdminView();

octopus.init();