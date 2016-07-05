
var availableNames = [
    'R2-D2',
    'Wall-E',
    'C-3PO',
    'Daneel Olivaw',
    'Nao',
    'Bumblebee',
    'Astro Boy',
    'Ash'
];

var i = 0;

function findName (callback) {
    if (availableNames.length > 0) {
        var name = availableNames[0];
        availableNames.splice(0, 1);
        return name;
    } else {
        i++;
        return 'unknown-'+i;
    }
}

module.exports.findName = findName;
