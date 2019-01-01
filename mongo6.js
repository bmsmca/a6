var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var ejs = require('ejs');
var app = express();

var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(expressValidator());

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://127.0.0.1/4db", function(err,db){

	if(!err)
	{
		console.log("We are connected");
		app.get('/', function(req,res){
			res.send("Welcome");
		})
		app.get('/index6.html', function(req,res){
			res.sendFile(__dirname + '/' + 'index6.html')
		})
		app.post('/process_post', urlencodedParser, function(req,res){
			req.checkBody('name', 'Name should not empty').notEmpty();
			req.checkBody('empID', 'EmpID should not empty').notEmpty();
			req.checkBody('dept', 'Department should not empty').notEmpty();
			req.checkBody('desg', 'Designation should not empty').notEmpty();
			req.checkBody('mob', 'Mobile number should not empty').notEmpty();
			req.checkBody('email', 'Email ID should not empty').notEmpty();

			req.checkBody('name', 'Name should contain only alphabets').isAlpha();
			req.checkBody('empID', 'EmpID should contain only Integers').isInt();
			req.checkBody('dept', 'Department should contain only alphabets').isAlpha();
			req.checkBody('desg', 'Designation should contain only Integers').isAlpha();
			req.checkBody('mob', 'Mobile number should contain only alphabets').isInt();
			req.checkBody('email', 'Email ID should contain only alphabets').isAlpha();
			
			var errors = req.validationErrors();
			if(errors)
			{
				res.send(errors);
				return;
			}
			else
			{
				var EMPID=req.body.empID
				var NAME=req.body.name
				var DEPT=req.body.dept
				var DESIGNATION=req.body.desg
				var MOB=req.body.mob
				var EMAIL=req.body.email
			
				db.collection('empDetails').insert({"empID":EMPID,"Name":NAME,"dept":DEPT,"designation":DESIGNATION,"mobile":MOB,"emailId":EMAIL}, function(err,doc){
				if(err)
				
					return console.log(err)
					
				else
				
					res.status(201).json(doc.ops[1])
				})	
					console.log("New Record Inserted");
					res.send("<p>EMPID:"+EMPID+"</p><p>Name:"+NAME+"</p><p>DEPARTMENT:"+DEPT+"</p><p>DESIGNATION:"+DESIGNATION+"</p><p>MOB:"+MOB+"</p><p>EMAIL:"+EMAIL+"</p>");
			}
		})

		app.get('/display', function(req, res){
			db.collection('empDetails').find().toArray(function (err, i){
				if(err)
					return console.log(err)
				res.render('45.ejs', {employee:i});
			});
		})	

		app.get('/sort', function(req, res){
			db.collection('empDetails').find().sort({empID:1}).toArray(function (err, i){
				if(err)
					return console.log(err)
				res.render('45.ejs', {employee:i});
			});
		})	
		
		app.get('/update.html', function(req,res){
			res.sendFile(__dirname+'/'+'update.html')
		})
	
		app.get('/update', function(req,res){
			var NAME = req.query.name;
			var DESIG = req.query.desg;
			
			db.collection('empDetails').update({"Name":NAME}, {$set:{"designation":DESIG}}, function (err, i){
				if(err)
					return console.log(err)
				else
					res.send("Record Updated!<br><a href='/index6.html'>Back</a>");
			});			
		})

		app.get('/delete', function(req, res){
			db.collection('empDetails').remove({"dept":"MCA"}, function(err, i){
				if (err)
					return console.log(err)
				else
					res.send("Record deleted successfully");
			});
		})

		var server = app.listen(5000, function(){
			var host = server.address().address;
			var port = server.address().port;
			console.log("Listening at http://%s:%s",host,port);
		})
	}
	else
	{
		db.close();
	}

})
