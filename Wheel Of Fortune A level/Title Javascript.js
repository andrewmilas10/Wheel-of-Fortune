/**
 * Created by tutumimi on 10/29/2016.
 */
console.log('hi');
var counter=0;
setTimeout(rotateLoop, .6);

//repeatedly rotates the wheel after a short delay, continuously checking if picture/word sizes should change
function rotateLoop() {
        document.getElementById('mainWheel').style.transform = 'rotate(' + counter + 'deg)';
        counter += .5;
        readjustSizes();
        setTimeout(rotateLoop, 1);
}

//readjusts the size of buttons, pictures and words based on the window's size
function readjustSizes() {
    var a=window.innerWidth;
    var b=window.innerHeight;
    document.getElementById('title').style.fontSize=a/16+'px';
    document.getElementById('small1').style.fontSize=a/22+'px';
    document.getElementById('small2').style.fontSize=a/22+'px';
    document.getElementById('small2').style.margin=b/3+'px 0 0 70%';
    document.getElementById('small3').style.fontSize=a/22+'px';
    document.getElementById('small3').style.marginTop=b*.45+'px';
    document.getElementById('mainWheel').style.width=a/5+'px';
    if (b<700) {
        document.getElementById('start').style.height=35+'px';
        document.getElementById('start').style.padding=5+'px';
        document.getElementById('start').style.fontSize=20+'px';
    }
    else {
        document.getElementById('start').style.height=50+'px';
        document.getElementById('start').style.paddingBottom=10+'px';
        document.getElementById('start').style.fontSize=26+'px';
    }
}