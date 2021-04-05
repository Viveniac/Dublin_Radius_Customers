// choosen Haversine
// formula:	a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
// c = 2 ⋅ atan2( √a, √(1−a) )
// distance = R ⋅ c
// where	φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
// note that angles need to be in radians to pass to trig functions!
    
let calculateDistance = (src, dest) => {
    var R = 6371; // metres

    Number.prototype.toRadians = function() {
        return this * Math.PI / 180;
    }

    var lat_src_in_radians = Number(src.lat).toRadians()
    var lat_dest_in_radians = dest.lat.toRadians()

    var dist_lat = (src.lat - dest.lat).toRadians(),
        dist_lon = (src.lon - dest.lon).toRadians();

    var a = Math.sin(dist_lat/2) * Math.sin(dist_lat/2) +
            Math.cos(lat_dest_in_radians) * Math.cos(lat_src_in_radians) *
            Math.sin(dist_lon/2) * Math.sin(dist_lon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var distance = R * c;

    return distance;
}

module.exports = {
    calculateDistance
}