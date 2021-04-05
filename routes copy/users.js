var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path')

var distance = require('../utils/distance')

/* GET users listing. */
router.get('/users', function (req, res, next) {
	res.send('respond with a resource');
});

router.get('/', function (req, res, next) {

	var outputCustomers = readCustomers()	
							.then((cust_from_file) => {

								let customers_data = {},
									customers_temp = [];

								customers_data = cust_from_file.replace(/\r\n/g, ',').replace(/\\/g, '');
								customers_temp = JSON.parse('[' + customers_data + ']')
								return checkIfWithinRadius(customers_temp);
							})
							.then((cust_within_rad) => {
								return sortCustomers(cust_within_rad)
							})
							.then((cust_sorted) => {
								let cust_sort_final_arr = [];

									cust_sorted.forEach((customer) => {
										let cust_sort_final_json = {};
										cust_sort_final_json.user_id = customer.user_id;
										cust_sort_final_json.name = customer.name;
										console.log(cust_sort_final_json.name)
										cust_sort_final_arr.push(cust_sort_final_json)
									})

								console.log("Customers Sorted Final within 100km radius: " + JSON.stringify(cust_sort_final_arr, null, 2))
								res.header("Content-Type",'application/json');

        						res.send(JSON.stringify(cust_sort_final_arr, null, 2));
							})
							.catch(err => {
								console.error(err);
							});

	function readCustomers(){
		return new Promise((resolve, reject) => {
			fs.readFile(path.join(__dirname, '../public/Customers.txt'), 'utf8', function readFileCallback(err, data) {
				if (err) {
					console.log("Error Reading customers from file: " + err);
					return reject(err)
				}
				else {
					resolve(data)
				}
			})
		})
	}

	function checkIfWithinRadius(customers_arr){
		return new Promise((resolve, reject) => {
			let cust_within_radius = [],
				source = {},
				destination = {								// Dublin coordinates to calculate distance from, proviided in the question 
					"lat" : 53.3498,
					"lon" : -6.2603
				},
				dist;

			customers_arr.forEach((customer) => {
				source.lat = customer.latitude;
				source.lon = customer.longitude;
				dist = distance.calculateDistance(source, destination);
				console.log(`distance for customer : ${dist}`);
				if(dist < 100) cust_within_radius.push(customer)
			});
			resolve(cust_within_radius);
		})
	}

	function sortCustomers(cust){
		return new Promise((resolve, reject) => {
			// Sort array
			cust.sort(function(a, b){
				return a["user_id"] - b["user_id"];
			});
			
			resolve(cust);
		})
	}

});

module.exports = router;