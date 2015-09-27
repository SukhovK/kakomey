/**
 * Created by Admin on 13.09.2015.
 */
var im = require('imagemagick');
console.log(im);
im.convert(['test.jpg', '-resize', '25x120', 'kittens-small.jpg'],
    function(err, stdout){
        if (err) throw err;
        console.log('stdout:', stdout);
    });