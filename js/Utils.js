function Utils(){}

Array.prototype.pull = function(ix){

    return Array.prototype.splice.apply(this, [ix, 1])[0];

};

module.exports = Utils;