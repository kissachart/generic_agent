
/*   Install Mysql
npm install mysql
npm install ini
npm install base-64
npm init -y
*/

var fs 		= require('fs');
var base64 	= require('base-64');
var mysql = require('mysql');
var paths = require("path");
var util = require('util');
var username = "";
var Password = "";
var port = "";
var ipaddress = "";
var config 	= require('ini').parse(fs.readFileSync('C:\\Program Files (x86)\\Gfin System\\ini\\gAgentDefault.ini', 'utf-8'));

config.Database  				= config['Database'];
IPAddress_database				= config.Database.IPAddress;
User_database					= config.Database.User;
Password_database 				= base64.decode(config.Database.Password);
Port_database					= config.Database.Port;
if (!User_database){
	var User_database = "root";
} else {
	var User_database = User_database;
}
if (!Password_database){
	var Password_database = "pass";
} else { 
	var Password_database = Password_database;
}
if (!Port_database){
	var Port_database = "3306";
} else {
	var Port_database = Port_database;
}
if (!IPAddress_database){
	var IPAddress_database = "127.0.0.1";
} else {
	var IPAddress_database = IPAddress_database;
}

var db_config = {
	host: IPAddress_database,
	  user: User_database,
	  password: Password_database,
	  port 	: Port_database
  };
writelog('Connect database parameter IP address : '+IPAddress_database+' Port : '+Port_database+' Username : '+User_database+' Password : '+Password_database);
var con = mysql.createPool(db_config);
/*
con.on('connection', function (err) {
	if (global.console_mode||global.debug_mode)console.log('Connect Database success parameter IPaddress : '+ipaddress+' Port : '+port+' Username : '+username+' Password : '+Password);
	writelog('Connect Database success parameter IPaddress : '+ipaddress+' Port : '+port+' Username : '+username+' Password : '+Password)
  })
  .on('error', function (connection) {
	if (global.console_mode||global.debug_mode)console.log('Connect Database Error parameter IPaddress : '+ipaddress+' Port : '+port+' Username : '+username+' Password : '+Password);
	writelog('Connect Database Error parameter IPaddress : '+ipaddress+' Port : '+port+' Username : '+username+' Password : '+Password)
  });
*/
/*
var conn = mysql.createConnection( db_config );

con.connect(function(err) {
writelog('Connect Database parameter IPaddress : '+ipaddress+' Port : '+port+' Username : '+username+' Password : '+Password);
 if (err) {
	 
	 writelog('Connect Database error parameter IPaddress : '+ipaddress+' Port : '+port+' Username : '+username+' Password : '+Password);
};
});
con.on('error', function onError(e) {
	log.slogWrite(log.p.LOG_ERR,0,MODULE + " encountered database error: "+e.code+".");
	if (e.code == 'PROTOCOL_CONNECTION_LOST') {   	
		db.reconnect();                         	
	}									
	else {
		// handle some error here.
	}
} );
*/
con.getConnection((err, connection) => {
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			print = 'Database connection lost.';
		}
		else if (err.code === 'ER_CON_COUNT_ERROR') {
			print = 'Database connection error.';
		}
		else if (err.code === 'ECONNREFUSED') {
			print = 'Database connection refused.';
		}
		else if (err.code === 'ETIMEDOUT') {
			print = 'Database connection timeout.';
		}
		else {
			print =err.code;
		}
		writelog('Connect Database error '+print+' parameter IPaddress : '+IPAddress_database+' Port : '+Port_database+' Username : '+User_database+' Password : '+Password_database);
	}
	
	if (connection) connection.release()
	
	if (connection != undefined){
		if (connection.state == "connected"){
			writelog('Connect Database success parameter IPaddress : '+IPAddress_database+' Port : '+Port_database);
		}
	}
	
	 return 
	 })
// Promisify for Node.js async/await.
con.query = util.promisify(con.query)
module.exports = con;

function writelog(text) {
	var d = new Date();
	var year = d.getFullYear();
	var month  = d.getMonth()+1;	month = '' + ((month < 10) ? '0' : '') + month;
	var date   = d.getDate();		date = '' + ((date < 10) ? '0' : '') + date;
	var hour   = d.getHours(); 		hour = '' + ((minute < 10) ? '0' : '') + hour;
	var minute = d.getMinutes();	minute = '' + ((minute < 10) ? '0' : '') + minute;
	var second = d.getSeconds();	second = '' + ((second < 10) ? '0' : '') + second;
	
	var line = year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second+" - "+text+"\r\n";
	// './' = localfloder
	if ((global.debug_mode||global.verbose_mode)&&global.console_mode)console.log(line);
	//LogFileName = paths.basename(__filename);
	//LogFileName = LogFileName.replace('.js','');
	LogFileName = SystemLogFileName.replace('yyyy',year);
    LogFileName = LogFileName.replace('mm',month);
    LogFileName = LogFileName.replace('dd',date);
	var path = (log_directory+'log/'+global.agent_name+LogFileName);
	path = path.replace(/[/]/gi,'\\');
	if (!fs.existsSync(log_directory+'log/')) {
		fs.mkdirSync(log_directory+'log/', { recursive: true })
	}
	else {
		fs.appendFile(path, line, function (err) {
			if (err) throw err;
		});
	}
};