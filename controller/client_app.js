var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../db.js');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
require('dotenv').config();
var jwt = require('jsonwebtoken');

console.log(process.env.base_url)


exports.cata_get_client = (req, res, next) => {
	db.query('select * from catagoris', function (error, cat_data, fields) {
		res.json({ cat_data });
	});
}

exports.subcatclient_get = (req, res, next) => {
	db.query('select * from subcategories', function (error, sub_cat_data, fields) {
		res.json({ "sub_cat_data": sub_cat_data });
	})
}

exports.sub_cat_client = (req, res, next) => {
	console.log(199, req.body.id)
	db.query("SELECT * FROM subcategories WHERE category_id = '" + req.body.id + "'", function (error, sub_id, fields) {
		res.json({ "sub_id": sub_id });
	})
}


exports.items_client = (req, res, next) => {
	db.query("SELECT * FROM items WHERE sub_cat_id = '" + req.body.id + "'", function (error, items, fields) {
		res.json({ "items": items });
	})
}


exports.signle_item_get_client = (req, res, next) => {
	db.query("SELECT * FROM items WHERE id = '" + req.body.id + "'", function (error, items, fields) {
		res.json({ "items": items });
	})
}


exports.search_items = (req, res, next) => {
	db.query('SELECT * FROM items WHERE item_name LIKE "%' + req.body.items_name + '%"', function (error, results, fields) {
		res.json({ "items": results });
	})

}



exports.client_regi = (req, res, next) => {
	try {
		const name = req.body.name
		const phone = req.body.phone
		const email = req.body.email
		const password = req.body.password
		const address = req.body.address

		const hashPass = bcrypt.hashSync(password, 10);
		var sql = "INSERT INTO client_user (name, phone, email, dbpassword, address) VALUES ('" + name + "', '" + phone + "', '" + email + "', '" + hashPass + "', '" + address + "')";

		db.query(sql, function (err, result) {
			if (err) {
				res.json({
					status: false,
					data: [""],
					message: 'error'
				})
			} else {
				res.json({
					status: true,
					data: result,
					message: 'user registered sucessfully'
				})
			}
		});
	}
	catch (err) {
		res.json({
			status: true,
			data: result,
			message: 'user registered sucessfully'
		})
	}
}





exports.client_login = (req, res, next) => {
	const phone = req.body.phone
	const password = req.body.password

	const token = jwt.sign({
		"username": req.body.phone
	}, "process.env.JWT_SECTRET", { expiresIn: '10h' });


	if (phone != '' && password != '') {
		db.query('SELECT * FROM client_user WHERE phone = ?', [phone], function (error, results, fields) {
			if (results.length > 0) {
				bcrypt.compare(password, results[0].dbpassword, function (err, ress) {
					const user_data = { name: results[0].name, email: results[0].email, address: results[0].address };
					if (!ress) {
						res.json({
							status: ress,
							message: 'error'
						})
					}
					else {
						res.json({
							status: ress,
							totke: token,
							data: user_data,
							message: 'user registered sucessfully'
						})
					}
				});
			}
			else {
				res.json({
					status: false,
					message: 'error'
				})
			}
		});
	}
}









