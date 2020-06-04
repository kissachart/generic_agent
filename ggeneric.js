/*
dependency:	
npm install os-service

*/
//////////////////////////////////////////////////////////////Require all module/////////////////////////////////////////////////////////////////////////
var service = require ("os-service");
var fs 		= require('fs');
const process = require('process');
var path = require("path");

//////////////////////////////////////////////////////////////Set variable for mode program/////////////////////////////////////////////////////////////////////////
global.install_service =  false;
global.uninstall_service =  false;
global.verbose_mode=  false;
global.offline_mode =false ;
global.debug_mode = false;
global.console_mode = false;
global.pringt_help = false;
global.agent_name;
//////////////////////////////////////////////////////////////Check agrument program//////////////////////////////////////////////////////////////////////////////
for(i=2;i <process.argv.length;i++){
    if(process.argv[i].toString().toLowerCase()=="/install"){
        global.install_service = true;
    }
    else if(process.argv[i].toString().toLowerCase()=="-v") {
        global.verbose_mode = true;
    }
    else if(process.argv[i].toString().toLowerCase()=="-o") {
        global.offline_mode = true;
    }
    else if(process.argv[i].toString().toLowerCase()=="-d") {
        global.debug_mode = true;
    }
    else if(process.argv[i].toString().toLowerCase()=="-c") {
        global.console_mode = true;
    }
    else if(process.argv[i].toString().toLowerCase()=="-h") {
        global.pringt_help = true;
    }
    else if(process.argv[i].toString().toLowerCase()=="/uninstall") {
        global.uninstall_service = true;
    }
    else if("-agent=".indexOf(process.argv[i].toString().toLowerCase()) == -1) {
        global.agent_name = process.argv[i];
        global.agent_name = global.agent_name.replace('-agent=','');
        if (global.agent_name == ''){
            global.agent_name = path.basename(__filename);
            global.agent_name = global.agent_name.replace('.js','');
        }
    }
}
//////////////////////////////////////////////////////////////Install service mode/////////////////////////////////////////////////////////////////////////
if (global.install_service == true){
    install_service_mode();
    process.exit;
}
//////////////////////////////////////////////////////////////Uninstall service mode/////////////////////////////////////////////////////////////////////////
else if(global.uninstall_service == true){
    uninstall_service_mode()
    process.exit;
}
else  if (global.install_service == false && global.uninstall_service == false){
//////////////////////////////////////////////////////////////Handle service run/////////////////////////////////////////////////////////////////////////
    service.run (function () {
        service.stop (0);
    });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Program run////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
module: 	event grasp agent (generic agent)
author: 	kittivud eabcharoen
version:	2.0.1 2019-11-26

dependency:	
npm install mysql
npm install ini
npm install base-64

remark:
	have event pud queue (incoming) and gsam/gcentral queue (outgoing).
*/

// part-0
global.MODULE		= "gAgentGeneric";
global.VERSION 		= "2.0.3";

var fs 		= require('fs');
var base64 	= require('base-64');

///////////////////////////////////////////////////////////////////defult variable config///////////////////////////////////////////////////
global.agent_name = "Generic";
version_agent                       = "1.0.0";
ip_generig                          = "127.0.0.1";
port_generig                        = "53899";
SendMessage_mode                    = true;
data_directory                      = 'C:/ProgramData/Gfin Data/';
log_directory                       = 'C:/ProgramData/Gfin Data/';
SystemLog                           = true;
EventLog                            = true;
DebugLog                            = false;
Verbose                             = false;
SystemLogFileName                   = "systemyyyymmdd.log";
EventLogFileName                    = "event-yyyy-mm-dd.log";
limitqueue                          = 32768;
maxclient                           = 1024;
mod_receive                         = "GSAM";
ip_receive                          = "127.0.0.1";
port_receive                        = "53891";
directory_upload                    = __dirname.replace(/[\\]/gi,'/');
var qFront 	= 0;
var qRear 	= 0;
var qLenght	= limitqueue;
var	queues 	= new Array(qLenght);
var agents 	= new Array(maxclient);
var agents_status 	= new Array(maxclient);
var ac = 0;
var gsamqFront 	= 0;
var gsamqRear 	= 0;
var gsamqLenght	=limitqueue;
var	gsamq 	= new Array(gsamqLenght);
var scready = false;
//Part 1 read configuration in ini file
    global.config 	= require('ini').parse(fs.readFileSync('C:\\Program Files (x86)\\Gfin System\\ini\\gAgentDefault.ini', 'utf-8'));

        config.log                          = config['Versions'];
        if (config.log != undefined && config.log.ini!=undefined) {
            version_agent =config.log.ini;
        }

        config.Log  						= config['Directory'];
        if (config.log != undefined && config.log.Data_Directory!=undefined){
            data_directory = config.log.Data_Directory
        }
        if (config.log != undefined && config.log.Log_Directory!=undefined){
            log_directory = config.log.Log_Directory
        }

        config.Log  						= config['Log File'];
        if (config.log != undefined && config.Log.SystemLog!=undefined){
            SystemLog = (config.Log.SystemLog.toString().toLowerCase()=='true' || config.Log.SystemLog.toString().toLowerCase()=='1' )?true:false;
        }
        if(config.log != undefined && config.Log.EventLog!=undefined){
            EventLog =  (config.Log.EventLog.toString().toLowerCase()=='true' || config.Log.EventLog.toString().toLowerCase()=='1' )?true:false;
        }
        if(config.log != undefined && config.Log.DebugLog!=undefined){
            DebugLog = (config.Log.DebugLog.toString().toLowerCase()=='true' || config.Log.DebugLog.toString().toLowerCase()=='1' )?true:false;
        }
        if(config.log != undefined && config.Log.Verbose!=undefined){
            Verbose = (config.Log.Verbose.toString().toLowerCase()=='true' || config.Log.Verbose.toString().toLowerCase()=='1' )?true:false;
        }
        if(config.log != undefined && config.Log.SystemLogFileName!=undefined){
            SystemLogFileName = config.Log.SystemLogFileName;

        }
        if (config.log != undefined && config.Log.EventLogFileName!=undefined){
            EventLogFileName = config.Log.EventLogFileName;
        }

        config.Log  						= config['Generic Agent'];
        if(config.log != undefined){
            if (config.Log.LimitQueue != undefined){
                limitqueue = config.Log.LimitQueue;
            }
            if(config.Log.BindAddress!=undefined){
                ip_generig = config.Log.BindAddress;
            }
            if(config.Log.ListenPort!=undefined){
                port_generig = config.Log.ListenPort;
            }
            if(config.Log.MaxClients!=undefined){
                maxclient = config.Log.MaxClients;
            }
            if(config.Log.MODE!=undefined){
                mod_receive = config.Log.MODE;
            }
            if(config.Log.DIRECTORY_UPLOAD!=undefined&&config.Log.DIRECTORY_UPLOAD!=""){
                directory_upload = config.Log.DIRECTORY_UPLOAD.replace(/[\\]/gi,'/');
            }
        }
        if (mod_receive.toString().toLowerCase() == "gsam"){
            config.Log  						= config['GSAM Connection'];
            if (config.Log != undefined ){
                ip_receive = config.Log.IPAddress;
                port_receive = config.Log.port;
            }
        }
        else if(mod_receive.toString().toLowerCase() == "gcentral"){
            config.Log  						= config['GCentral Connection'];
            if (config.Log != undefined ){
                ip_receive = config.Log.IPAddress;
                port_receive = config.Log.port;
            }
        }
        if (limitqueue != undefined) {
            queues.length                   = limitqueue;
            qLenght	                        = limitqueue;
            gsamq.length                    = limitqueue;
            gsamqLenght                     = limitqueue;
        }
        
        agents.length                   = maxclient;
        agents_status.length            = maxclient;
//Part 1 end.

//Part 2 connect database
database = require('./connectdatabase');
//Part 2 end.

//Part 3 Create TCP server and check message and insert in queue poll
var readline = require('readline');
var net 	 = require('net');
var q80percent = ((qLenght*80)/100);
var aggsock  = net.createServer(function (socket) {
	var pdu = readline.createInterface(socket, socket);
    pdu.on('line', function (msg) {
            // check system_name ?
            var fields=msg.split("|");
			if (agents[fields[0]]==undefined && agents[fields[2]]==undefined) {
                write_log(1,"UNKNOWN PDU SYSTEM_NAME: "+fields[0]+". Message : "+msg);
			}
			else {
			    //ignormessage(msg,function(result_check_ignor_message){
				//	if (result_check_ignor_message == 0){
                        //check message heart beat
                        if (fields[5]!="AGENT_STATUS"&&fields[6]!="HB"){
                            // put pdu to queue
                            let r=qRear;
                            queues[qFront++] = msg;
                            if (qFront>qRear){
                                if((qFront-qRear)>=qLenght){
                                    write_log(1,"queue full, discard the oldest.queue discard is : "+queues[qRear]);
                                    qRear = qRear+1;
                                }
                                else {
                                    qRear = qRear;
                                }
                            }
                            else {
                                if((qFront-qRear+qLenght)>=qLenght){
                                    write_log(1,"queue full, discard the oldest.queue discard is : "+queues[qRear]);
                                    qRear = qRear+1;
                                }
                                else {
                                    qRear = qRear;
                                }
                            }
                            //qRear  = ( (qFront>qRear)?(qFront-qRear):(qFront-qRear+qLenght)  )>=qLenght?qRear+1:qRear;		// queue full, discard the oldest
                            qFront = (qFront<qLenght)?qFront:0;			// wrap around
                            qRear  = (qRear<qLenght)?qRear:0;			// wrap around
                            if (r!=qRear) write_log(1,"queue full, discard the oldest.");
                            write_log(3,"GET ["+qFront+"] \""+msg+"\"");
                        }
                        write_log(3,"GET \""+msg+"\"");

                        //update stamptime 
                        if (agents[fields[0]]==undefined){
                            agents_status [agents[fields[2]].AGENT_NAME].STAMPTIME=new Date();// stamp new datetime

                        }
                        else {
                            agents_status [agents[fields[0]].AGENT_NAME].STAMPTIME=new Date();// stamp new datetime
                        }
                        //check quese in and out if load over 80% write log warning
						qrang =((qFront>gsamqRear)?(qFront-gsamqRear):(gsamqRear-qFront));
						if (qrang >=q80percent) {
                            write_log(1,"queue get and quese send in generic have a distance of more than 80 percent");
						}
					//}
				//});
			} 
	});
	socket.on('error', (err) => {
		// Handle errors here.
        write_log(1,"TCP error : "+err+" server IP : "+ip_generig+" Port : "+port_generig+".Please restart gerneric.");
	  })
	  .on('end', (err) => {
	  })
	  .on('destroyed', (err) => {
	  });

});
aggsock.on('error', (err) => {
    write_log(1,err+".");
  });
aggsock.maxConnections = maxclient;
//Part 3 end.

//Part 4 select agent and save for check timeout
        async function getagents() {
            write_log(1,"load agents parameters ...");
            try{
                agents= await database.query("select * from gplatform.agents where CONTROL in (1,2)");
                agents.forEach( function  (value) {
                    // increase stamptime from field database
                    value.STAMPTIME = new Date();
                    value.FIRST_STAMPTIME = new Date();
                    // save agent_name into agent status list array
                    agents_status [value.AGENT_NAME] = value
                    // save agent_name into agent list array
                    agents[ value.AGENT_NAME ]=value;
                    //check value in field ip address is not null
                    if (value.AGENT_IP != null && value.AGENT_IP != ''){
                        //spilt ip in field ip address with comma
                        var array_for_ip = [value.AGENT_IP].join(',').split(',');
                        if (array_for_ip.length > 0){
                            for (i = 0;i<array_for_ip.length;i++){
                                agents[ array_for_ip[i] ]=value;
                            };
                        };
                    };
                 });
                write_log(1,"load agents parameters finished.");
            } catch (err) {
                write_log(1,"Can't get agent from database gplatform.agents from database ip :"+IPAddress_database+". Program will retry in 1 secound.");
                setTimeout(()=>{
                    getagents();
                }, 1000);
            }
        };
//Part 4 end.    

//Part 5 check ignor event
        function ignormessage(messagedpu,callback){
            var resultignor = 0;
            var fields=messagedpu.split("|");
            fs.access('C:/ProgramData/Gfin Data/ini/GenericIgnoreEvent.ini', fs.F_OK, (err) => {
                if (err) {
                    resultignor = 0;
                    callback(resultignor);
                }
                else{
                    var GenericIgnoreEvent 	= require('ini').parse(fs.readFileSync('C:/ProgramData/Gfin Data/ini/GenericIgnoreEvent.ini', 'utf-8'));
                    SYSTEM_NAME                	= GenericIgnoreEvent['SYSTEM_NAME'];
                    if (SYSTEM_NAME != undefined){
                        var SYSTEM_NAME 			= Object.keys(SYSTEM_NAME);
                            for(let i = 0; i < SYSTEM_NAME.length; i++){
                                var result = fields[0].toString().toLowerCase().indexOf(SYSTEM_NAME[i].toString().toLowerCase());
                                    if (result != '-1'){
                                        resultignor = ++resultignor;
                                    }
                            }
                    }
                    IP_ADDRESS                	= GenericIgnoreEvent['IP_ADDRESS'];
                    if (IP_ADDRESS != undefined){
                        var IP_ADDRESS 				= Object.keys(IP_ADDRESS);
                            for(let i = 0; i < IP_ADDRESS.length; i++){
                                var result = fields[2].toString().toLowerCase().indexOf(IP_ADDRESS[i].toString().toLowerCase());
                                    if (result != '-1'){
                                        resultignor = ++resultignor;
                                    }
                            }
                        }
                    DEVICE_NAME                	= GenericIgnoreEvent['DEVICE_NAME'];
                    if (DEVICE_NAME != undefined){
                        var DEVICE_NAME 			= Object.keys(DEVICE_NAME);
                            for(let i = 0; i < DEVICE_NAME.length; i++){
                                var result = fields[3].toString().toLowerCase().indexOf(DEVICE_NAME[i].toString().toLowerCase());
                                    if (result != '-1'){
                                        resultignor = ++resultignor;
                                    }
                            }
                        }
                    DEVICE_ADDRESS              = GenericIgnoreEvent['DEVICE_ADDRESS'];
                    if (DEVICE_ADDRESS != undefined){
                        var DEVICE_ADDRESS 			= Object.keys(DEVICE_ADDRESS);
                            for(let i = 0; i < DEVICE_ADDRESS.length; i++){
                                var result = fields[4].toString().toLowerCase().indexOf(DEVICE_ADDRESS[i].toString().toLowerCase());
                                    if (result != '-1'){
                                        resultignor = ++resultignor;
                                    }
                            }
                    }
                    EVENT_ID                	= GenericIgnoreEvent['EVENT_ID'];
                    if (EVENT_ID != undefined){
                        var EVENT_ID 				= Object.keys(EVENT_ID);
                            for(let i = 0; i < EVENT_ID.length; i++){
                                var result = fields[5].toString().toLowerCase().indexOf(EVENT_ID[i].toString().toLowerCase());
                                    if (result != '-1'){
                                        resultignor = ++resultignor;
                                    }
                            }
                    }
                    Ignore_Event           		= GenericIgnoreEvent['Ignore Event'];
                    if (Ignore_Event != undefined){
                        var Ignore_Event 			= Object.keys(Ignore_Event);
                            for(let i = 0; i < Ignore_Event.length; i++){
                                var result = fields[5].toString().toLowerCase().indexOf(Ignore_Event[i].toString().toLowerCase());
                                    if (result != '-1'){
                                        resultignor = ++resultignor;
                                    }
                            }
                    }
                    EVENT_DATA              	= GenericIgnoreEvent['EVENT_DATA'];
                    if (EVENT_DATA != undefined){
                        var EVENT_DATA 				= Object.keys(EVENT_DATA);
                            for(let i = 0; i < EVENT_DATA.length; i++){
                                var result = fields[6].toString().toLowerCase().indexOf(EVENT_DATA[i].toString().toLowerCase());
                                    if (result != '-1'){
                                        resultignor = ++resultignor;
                                    }
                            }
                    }
                    EVENT_DESCRIPTION           = GenericIgnoreEvent['EVENT_DESCRIPTION'];
                    if (EVENT_DESCRIPTION != undefined){
                        var EVENT_DESCRIPTION 		= Object.keys(EVENT_DESCRIPTION);
                            for(let i = 0; i < EVENT_DESCRIPTION.length; i++){
                                var result = fields[7].toString().toLowerCase().indexOf(EVENT_DATA[i].toString().toLowerCase());
                                    if (result != '-1'){
                                        resultignor = ++resultignor;
                                    }
                            }
                    }
                    callback(resultignor);
                }
              })
              
        
        }
//Part 5 end.

//Part 6 connect receive

var sc = new net.Socket();
	sc.on('connect',function(){
        scready = true;
        write_log(1,"connect to gsam/gcentral at "+ip_receive+":"+port_receive+".");
	})
	.on('ready',function(){ scready = true; write_log(1,"connected to gsam/gcentral success at "+ip_receive+":"+port_receive+".");})
	.on('drain',function(){ scready = true; write_log(1,"connected to gsam/gcentral success at "+ip_receive+":"+port_receive+".");})
	.on('data',function(){})
	.on('end',function(){})
	.on('timeout',function(){})
	.on('error',function(e){ scready = false; })
	.on('close', function(e) {
		scready = false;
		if (!sc.connecting) setTimeout(gsam_connect, 1000);    	// introduce delay before next round.
        // -- gsam down write syslog error --
        write_log(1,"connection broken from gsam/gcentral at "+ip_receive+":"+port_receive+".Reconnect in 1 second");
    });

    function gsam_connect() {
        sc.connect(port_receive,ip_receive);
    }
//Part 6 end.

//Part 7 queue main
function gsam_push(text) {
    // push gsam message to gsamqueue.
        gsamq[gsamqFront++] = text;
        gsamqRear  = ( (gsamqFront>gsamqRear)?(gsamqFront-gsamqRear):(gsamqFront-gsamqRear+gsamqLenght) )>=gsamqLenght?gsamqRear+1:gsamqRear;		// queue full, discard the oldest
        gsamqFront = (gsamqFront<gsamqLenght)?gsamqFront:0;			// wrap around
        gsamqRear  = (gsamqRear<gsamqLenght)?gsamqRear:0;			// wrap around
    }
//Part 7 end.

//Part 8 loop poll
async function loop_main() {
	// part-2.1 fetch queue and write to database.
	while (qFront!=qRear) {
        //console.log(qFront,qRear,queues[qRear]); 
        var GSAM_message = undefined;
        //       
        // write to database here
        // call incoming_event_handler(`SYSTEM_NAME`,DATE_TIME,'IP_ADDRESS','DEVICE_NAME','DEVICE_ID','DEVICE_ADDRESS','EVENT_ID','EVENT_DATA','EVENT_DESCRIPTION');
    	var fields=queues[qRear].split("|");
		qRear  = (++qRear<qLenght)?qRear:0;				// advance qRear and wrap around
    	// remark: if mysql error, this pdu will lost.
        //
        for (var i=0;i<10;i++){ fields[i]=(fields[i]==undefined)?"":fields[i];};
        //Check attechment
        var check_image_preview_in_attechment = fields[8].includes('image_preview:');
        var check_image_snap_in_attechment = fields[8].includes('image_snap:');
        var check_image_face_in_attechment = fields[8].includes('image_face:');
        if (check_image_preview_in_attechment||check_image_snap_in_attechment||check_image_face_in_attechment){
            var d = new Date();
            console.log(d);
            var year = d.getFullYear();
            var month  = d.getMonth()+1;	month = '' + ((month < 10) ? '0' : '') + month;
            var date   = d.getDate();		date = '' + ((date < 10) ? '0' : '') + date;
            var hour   = d.getHours(); 		hour = '' + ((minute < 10) ? '0' : '') + hour;
            var minute = d.getMinutes();	minute = '' + ((minute < 10) ? '0' : '') + minute;
            var second = d.getSeconds();	second = '' + ((second < 10) ? '0' : '') + second;
            var floder_date_name =year+month+date;
            if (!fs.existsSync(path.join(directory_upload, '/media_log/image',floder_date_name))) {
                fs.mkdirSync(path.join(directory_upload, '/media_log/image',floder_date_name), { recursive: true });

            }
        }
        //replace base64 to directory
        if(check_image_preview_in_attechment){
            var string_base64_image_preview = fields[8];
            string_base64_image_preview = string_base64_image_preview.split('image_preview:');
            var file_extension_image_preview = string_base64_image_preview[1];
            file_extension_image_preview = file_extension_image_preview.split(';');
            file_extension_image_preview = file_extension_image_preview[0].split('/');
            file_extension_image_preview = file_extension_image_preview[1];
            string_base64_image_preview = string_base64_image_preview[1].split(',');
            string_base64_image_preview = string_base64_image_preview[1];
            /*var datetime = (new Date()).toISOString();
            datetime = datetime.replace(/T|-|:|z|\./gi,'');*/
            var d = new Date();
            var year = d.getFullYear();
            var month  = d.getMonth()+1;	month = '' + ((month < 10) ? '0' : '') + month;
            var date   = d.getDate();		date = '' + ((date < 10) ? '0' : '') + date;
            var hour   = d.getHours(); 		hour = '' + ((minute < 10) ? '0' : '') + hour;
            var minute = d.getMinutes();	minute = '' + ((minute < 10) ? '0' : '') + minute;
            var second = d.getSeconds();	second = '' + ((second < 10) ? '0' : '') + second;
            var millisecond = d.getMilliseconds();	millisecond = '' + ((millisecond < 10) ? '0' : '') + millisecond;
            var datetime = year+month+date+hour+minute+second+millisecond;
            var file_name_image_preview = "image_preview_"+datetime+"."+file_extension_image_preview;
            fields[8] = fields[8].replace(string_base64_image_preview,directory_upload+"/media_log/image/"+floder_date_name+"/"+file_name_image_preview);
        }
        if(check_image_snap_in_attechment){
            var string_base64_image_snap = fields[8];
            string_base64_image_snap = string_base64_image_snap.split('image_snap:');
            var file_extension_image_snap = string_base64_image_snap[1];
            file_extension_image_snap = file_extension_image_snap.split(';');
            file_extension_image_snap = file_extension_image_snap[0].split('/');
            file_extension_image_snap = file_extension_image_snap[1];
            string_base64_image_snap = string_base64_image_snap[1].split(',');
            string_base64_image_snap = string_base64_image_snap[1];
            /*var datetime = (new Date()).toISOString();
            datetime = datetime.replace(/T|-|:|z|\./gi,'');*/
            var d = new Date();
            var year = d.getFullYear();
            var month  = d.getMonth()+1;	month = '' + ((month < 10) ? '0' : '') + month;
            var date   = d.getDate();		date = '' + ((date < 10) ? '0' : '') + date;
            var hour   = d.getHours(); 		hour = '' + ((minute < 10) ? '0' : '') + hour;
            var minute = d.getMinutes();	minute = '' + ((minute < 10) ? '0' : '') + minute;
            var second = d.getSeconds();	second = '' + ((second < 10) ? '0' : '') + second;
            var millisecond = d.getMilliseconds();	millisecond = '' + ((millisecond < 10) ? '0' : '') + millisecond;
            var datetime = year+month+date+hour+minute+second+millisecond;
            var file_name_image_snap = "image_snap_"+datetime+"."+file_extension_image_snap;
            fields[8] = fields[8].replace(string_base64_image_snap,directory_upload+"/media_log/image/"+floder_date_name+"/"+file_name_image_snap);
        }
        if(check_image_face_in_attechment){
            var string_base64_image_face = fields[8];
            string_base64_image_face = string_base64_image_face.split('image_face:');
            var file_extension_image_face = string_base64_image_face[1];
            file_extension_image_face = file_extension_image_face.split(';');
            file_extension_image_face = file_extension_image_face[0].split('/');
            file_extension_image_face = file_extension_image_face[1];
            string_base64_image_face = string_base64_image_face[1].split(',');
            string_base64_image_face = string_base64_image_face[1];
            /*var datetime = (new Date()).toISOString();
            datetime = datetime.replace(/T|-|:|z|\./gi,'');*/
            var d = new Date();
            var year = d.getFullYear();
            var month  = d.getMonth()+1;	month = '' + ((month < 10) ? '0' : '') + month;
            var date   = d.getDate();		date = '' + ((date < 10) ? '0' : '') + date;
            var hour   = d.getHours(); 		hour = '' + ((minute < 10) ? '0' : '') + hour;
            var minute = d.getMinutes();	minute = '' + ((minute < 10) ? '0' : '') + minute;
            var second = d.getSeconds();	second = '' + ((second < 10) ? '0' : '') + second;
            var millisecond = d.getMilliseconds();	millisecond = '' + ((millisecond < 10) ? '0' : '') + millisecond;
            var datetime = year+month+date+hour+minute+second+millisecond;
            var file_name_image_face = "image_face_"+datetime+"."+file_extension_image_face;
            fields[8] = fields[8].replace(string_base64_image_face,directory_upload+"/media_log/image/"+floder_date_name+"/"+file_name_image_face);
        }
        if (fields[8] != "" && fields[8] !=undefined){
            fields[7] = fields[7]+","+fields[8];
        }       

        try{
            write_log(2,"call incoming ["+qRear+"]- call gplatform.incoming_event_handler('"+
            fields[0]+"','"+
            fields[1]+"','"+
            fields[2]+"','"+
            fields[3]+"','"+
            fields[4]+"','"+
            "','"+
            fields[5]+"','"+
            fields[6]+"','"+
            fields[7]+"'"+
            ");");
            var query= await database.query("call gplatform.incoming_event_handler('"+
                                                                        fields[0]+"','"+
                                                                        fields[1]+"','"+
                                                                        fields[2]+"','"+
                                                                        fields[3]+"','"+
                                                                        fields[4]+"','"+
                                                                        "','"+
                                                                        fields[5]+"','"+
                                                                        fields[6]+"','"+
                                                                        fields[7]+"'"+
                                                                        ");");
                query.forEach( function  (value) { 
                    if (value.length > 0){
                        if (value[0].GSAM!= undefined) {
                            GSAM_message = value[0].GSAM;
                            GLOG_ID = value[0].GLOG_ID;
                        }
                        else {
                            GSAM_message = undefined;
                        }
                    }
                }); 
            } catch (err) {
                write_log(2,"call incoming error ["+qRear+"]- "+err.message);
            }
            write_log(4,"GSAM_message : "+GSAM_message);
            if (GSAM_message != undefined){
                gsam_push(GSAM_message);
                if(check_image_preview_in_attechment){
                    write_log(4,"image_preview : "+string_base64_image_preview);
                    var decodebase64_to_file = await base64_decode(string_base64_image_preview,directory_upload+"/media_log/image/"+floder_date_name+"/"+file_name_image_preview);
                    if (decodebase64_to_file != 1){
                        var query= await database.query("update glog.gsoc_events set EVENT_DESC = repalce(EVENT_DESC,'"+directory_upload+"/media_log/image/"+floder_date_name+"/"+file_name_image_preview+"',''Uploads file error'') where GLOG_ID = '"+GLOG_ID+"';");
                      }
                }
                if(check_image_snap_in_attechment){
                    var decodebase64_to_file = await base64_decode(string_base64_image_snap,directory_upload+"/media_log/image/"+floder_date_name+"/"+file_name_image_snap);
                    if (decodebase64_to_file != 1){
                        var query= await database.query("update glog.gsoc_events set EVENT_DESC = repalce(EVENT_DESC,'"+directory_upload+"/media_log/image/"+floder_date_name+"/"+file_name_image_snap+"',''Uploads file error'') where GLOG_ID = '"+GLOG_ID+"';");
                      }
                }
                if(check_image_face_in_attechment){
                    var decodebase64_to_file = await base64_decode(string_base64_image_face,directory_upload+"/media_log/image/"+floder_date_name+"/"+file_name_image_face);
                    if (decodebase64_to_file != 1){
                        var query= await database.query("update glog.gsoc_events set EVENT_DESC = repalce(EVENT_DESC,'"+directory_upload+"/media_log/image/"+floder_date_name+"/"+file_name_image_face+"',''Uploads file error'') where GLOG_ID = '"+GLOG_ID+"';");
                      }
                }
                write_log(2,"incoming match!!! ["+qRear+"]    - call gplatform.incoming_event_handler('"+
                                                                                                fields[0]+"','"+
                                                                                                fields[1]+"','"+
                                                                                                fields[2]+"','"+
                                                                                                fields[3]+"','"+
                                                                                                fields[4]+"','"+
                                                                                                "','"+
                                                                                                fields[5]+"','"+
                                                                                                fields[6]+"','"+
                                                                                                fields[7]+"'"+
                                                                                                ");");
            }
            else if (GSAM_message == undefined){
                write_log(2,"incoming not match!!! ["+qRear+"]- call gplatform.incoming_event_handler('"+
                                                                                                    fields[0]+"','"+
                                                                                                    fields[1]+"','"+
                                                                                                    fields[2]+"','"+
                                                                                                    fields[3]+"','"+
                                                                                                    fields[4]+"','"+
                                                                                                    "','"+
                                                                                                    fields[5]+"','"+
                                                                                                    fields[6]+"','"+
                                                                                                    fields[7]+"'"+
                                                                                                    ");");
            }
            
	}
	// part 2.2 check agent timeout.
    var d = new Date(); 
	Object.keys(agents_status).forEach(async function _(key){
        var d=new Date();	// current date time
        var year = d.getFullYear();
        var month  = d.getMonth()+1;	month = '' + ((month < 10) ? '0' : '') + month;
        var date   = d.getDate();		date = '' + ((date < 10) ? '0' : '') + date;
        var hour   = d.getHours(); 		hour = '' + ((minute < 10) ? '0' : '') + hour;
        var minute = d.getMinutes();	minute = '' + ((minute < 10) ? '0' : '') + minute;
        var second = d.getSeconds();	second = '' + ((second < 10) ? '0' : '') + second;
        var datetime =  year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
        var date =year+"-"+month+"-"+date;
        var time = hour+":"+minute+":"+second;
		if (Math.round((d-agents_status[key].STAMPTIME)/1000)>=agents_status[key].AGENT_TIMEOUT*60) {
			// this agent is timeout.
            // -- send trouble message --
            
            // write agent timeout log
            //Check agent lost
            if (agents_status[key].STAMPTIME.getTime() === agents_status[key].FIRST_STAMPTIME.getTime()){
                write_log(2,"Agent Lost: "+key+" does not response in "+agents_status[key].AGENT_TIMEOUT+" minutes.");
                var GSAM_message = undefined;
                try{
                    write_log(2,"call gplatform.incoming_event_handler('"+
                                                                        "Generic','"+
                                                                        datetime+"','"+
                                                                        "','"+
                                                                        key+"','"+
                                                                        "','"+
                                                                        "','"+
                                                                        "GL_AGENT_LOST','"+
                                                                        "','"+
                                                                        key+" do not send signals.Please check "+key+" in machine installed.'"+
                                                                        ");");
                    var query= await database.query("call gplatform.incoming_event_handler('"+
                                                                            "Generic','"+
                                                                            datetime+"','"+
                                                                            "','"+
                                                                            key+"','"+
                                                                            "','"+
                                                                            "','"+
                                                                            "GL_AGENT_LOST','"+
                                                                            "','"+
                                                                            key+" do not send signals.Please check "+key+" in machine installed.'"+
                                                                            ");");
                   
                        query.forEach( function  (value) { 
                            if (value.length > 0){
                                if (value[0].GSAM!= undefined) {
                                    GSAM_message = value[0].GSAM;
                                }
                                else {
                                    GSAM_message = undefined;
                                }
                            }
                        }); 
                }catch(err){
                    write_log(2,"call incoming error ["+qRear+"]- "+err.message);
                }

                if (GSAM_message != undefined){
                    gsam_push(GSAM_message);
                    write_log(2,"incoming match!!! ["+qRear+"]    -call gplatform.incoming_event_handler('"+
                                                                                            "Generic','"+
                                                                                            datetime+"','"+
                                                                                            "','"+
                                                                                            key+"','"+
                                                                                            "','"+
                                                                                            "','"+
                                                                                            "GL_AGENT_LOST','"+
                                                                                            "','"+
                                                                                            key+" do not send signals.Please check "+key+" in machine installed.'"+
                                                                                            ");");
                }
                else if (GSAM_message == undefined){
                    write_log(2,"incoming not match!!! ["+qRear+"]- call gplatform.incoming_event_handler('"+
                                                                                            "Generic','"+
                                                                                            datetime+"','"+
                                                                                            "','"+
                                                                                            key+"','"+
                                                                                            "','"+
                                                                                            "','"+
                                                                                            "GL_AGENT_LOST','"+
                                                                                            "','"+
                                                                                            key+" do not send signals.Please check "+key+" in machine installed.'"+
                                                                                            ");");
                }

            }
            //Check agent time out
            else {
                write_log(2,"Agent Timeout: "+key+" does not response in "+agents_status[key].AGENT_TIMEOUT+" minutes.");
                var GSAM_message = undefined;
                try{
                    write_log(2,"call gplatform.incoming_event_handler('"+
                                                        "Generic','"+
                                                        datetime+"','"+
                                                        "','"+
                                                        key+"','"+
                                                        "','"+
                                                        "','"+
                                                        "GL_AGENT_TIMEOUT','"+
                                                        "','"+
                                                        key+" do not send signal in time.Please check "+key+" in machine installed.'"+
                                                        ");");
                    var query= await database.query("call gplatform.incoming_event_handler('"+
                                                                            "Generic','"+
                                                                            datetime+"','"+
                                                                            "','"+
                                                                            key+"','"+
                                                                            "','"+
                                                                            "','"+
                                                                            "GL_AGENT_TIMEOUT','"+
                                                                            "','"+
                                                                            key+" do not send signal in time.Please check "+key+" in machine installed.'"+
                                                                            ");");
                        query.forEach( function  (value) { 
                            if (value.length > 0){
                                if (value[0].GSAM!= undefined) {
                                    GSAM_message = value[0].GSAM;
                                }
                                else {
                                    GSAM_message = undefined;
                                }
                            }
                        }); 
                }catch (err){
                    write_log(2,"call incoming error ["+qRear+"]- "+err.message);
                }
                if (GSAM_message != undefined){
                    gsam_push(GSAM_message);
                    write_log(2,"incoming match!!! ["+qRear+"]    -call gplatform.incoming_event_handler('"+
                                                                                            "Generic','"+
                                                                                            datetime+"','"+
                                                                                            "','"+
                                                                                            key+"','"+
                                                                                            "','"+
                                                                                            "','"+
                                                                                            "GL_AGENT_TIMEOUT','"+
                                                                                            "','"+
                                                                                            key+" do not send signal in time.Please check "+key+" in machine installed.'"+
                                                                                            ");");
                }
                else if (GSAM_message == undefined){
                    write_log(2,"incoming not match!!! ["+qRear+"]- call gplatform.incoming_event_handler('"+
                                                                                            "Generic','"+
                                                                                            datetime+"','"+
                                                                                            "','"+
                                                                                            key+"','"+
                                                                                            "','"+
                                                                                            "','"+
                                                                                            "GL_AGENT_TIMEOUT','"+
                                                                                            "','"+
                                                                                            key+" do not send signal in time.Please check "+key+" in machine installed.'"+
                                                                                            ");");
                }
            }//Check agent lost end.
			//
            agents_status[key].STAMPTIME = d;				// set new startpoint.
		}
	});	
    
    setTimeout(loop_main, 1000);    				// introduce delay before next round.
}
//Part 8 end.

//Part 9 loop main
function loop_gsam() {
    // loop to pull gsam message from queue and send to gsam/gcentral process.
        if (scready) {
            // write gsam message to gsam process.
            while (gsamqFront!=gsamqRear) {
                scready = false;
                if (sc.write( gsamq[gsamqRear]+"\r\n" )) scready = true;
                gsamqRear  = (++gsamqRear<gsamqLenght)?gsamqRear:0;			// advance qRear and wrap around
            }
        }
        setTimeout(loop_gsam, 1000);    				// introduce delay before next round.
    }
//Part 9 end.
    async function main() {
        aggsock.listen( port_generig, ip_generig,function(o){
            write_log(1,"Open TCP server IP : "+ip_generig+" Port : "+port_generig+".");
        });
        gsam_connect();
        getagents();
        loop_main();
        loop_gsam();
        
    }
main();
//Part decode 64 to file
function base64_decode(base64str, file) {
    return new Promise(function (fulfill, reject){
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer.from(base64str, 'base64');
    // write buffer to file
    fs.writeFile(file, bitmap, function (err, res){
      if (err) {
        reject(0);
      }
      else {
        fulfill(1)};
    });
    //console.log('******** File created from base64 encoded string ********');
    })
  }
//Part decode 64 to file end
//Part write log
        function write_log(system,text) {
            //system = 1, event =2 
            var enable_write_log = false ;
            system = system.toString().toLowerCase();
            var d = new Date();
            var year = d.getFullYear();
            var month  = d.getMonth()+1;	month = '' + ((month < 10) ? '0' : '') + month;
            var date   = d.getDate();		date = '' + ((date < 10) ? '0' : '') + date;
            var hour   = d.getHours(); 		hour = '' + ((minute < 10) ? '0' : '') + hour;
            var minute = d.getMinutes();	minute = '' + ((minute < 10) ? '0' : '') + minute;
            var second = d.getSeconds();	second = '' + ((second < 10) ? '0' : '') + second;
            
            
            var line = year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second+" - "+text+"\r\n";
            if (global.debug_mode&&global.console_mode)console.log(line);
            // './' = localfloder
            if (system == "1"||system == "system"){
                LogFileName = SystemLogFileName.replace('yyyy',year);
                LogFileName = LogFileName.replace('mm',month);
                LogFileName = LogFileName.replace('dd',date);
                LogFileName = global.agent_name+LogFileName
                enable_write_log = SystemLog;
            }else if (system == "2"||system  == "event"){
                if (global.verbose_mod&&global.console_mode&&!global.debug_mode)console.log(line);
                LogFileName = EventLogFileName.replace('yyyy',year);
                LogFileName = LogFileName.replace('mm',month);
                LogFileName = LogFileName.replace('dd',date);
                LogFileName = global.agent_name+LogFileName
                enable_write_log = EventLog;
            } else if (system == "3"||system  == "debug"){
                LogFileName = global.agent_name+"debug"+year+"-"+month+"-"+date+".log";
                enable_write_log = DebugLog;
            } else {
                LogFileName = global.agent_name+"other"+year+"-"+month+"-"+date+".log";
                enable_write_log = true ;
            }
            if (enable_write_log){
                var path = (log_directory+'log/'+LogFileName);
                path = path.replace(/[/]/gi,'\\');
                if (!fs.existsSync(log_directory+'log/')) {
                    fs.mkdirSync(log_directory+'log/', { recursive: true })
                }
                else {
                    fs.appendFile(path, line, function (err) {
                        if (err) console.log(err);
                    });
                }
            }
        };
//Part write log end.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Program end////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
else {
    help("Parameter mode program not valid.");
};

function install_service_mode(){
    if (global.agent_name == undefined || global.agent_name == ""){
        global.agent_name = path.basename(__filename);
        global.agent_name = global.agent_name.replace('.js','');
    }
        var service_name = global.agent_name;
        var options = {
            programPath:__filename,
            displayName: global.agent_name/*,
            programArgs: ["-agent="+agent_name]*/
        };
        service.add (service_name, options, function(error){ 
            if (error){
                console.log(error);
            }
            else{
                console.log("Install sevice : "+service_name+" success.");
            }
         });
}
function uninstall_service_mode(){
    if (global.agent_name == undefined || global.agent_name == ""){
        global.agent_name = path.basename(__filename);
        global.agent_name = global.agent_name.replace('.js','');
    }
        var service_name = global.agent_name;
        service.remove (service_name,  function(error){ 
            if (error){
                console.trace(error);
            }
            else{
                console.log("Uninstall sevice : "+service_name+" success.");
            }
         });
}

function help(text){
    console.log("Help {"+
    "Usgae: [node Project.js -v -o -Agent=sevice_name]\r\n"+
    //"Usgae: [node Project.js -v -o -Agent=ini_name]\r\n"+
    "-v: Verbose mode, show event message on console.\r\n"+
    "-o: Offline mode, don't send event message to server.\r\n"+
    "-d: debug mode - printout debug message on console.\r\n"+
    "-c: console mode - run application in console mode (disable service mode).\r\n"+
    "-Agent=<sevice_name>.\r\n"+
    //"-Agent=<ini filename>.\r\n"+
    "/INSTALL - install Windows service.\r\n"+
    "/UNINSTALL - remove Windows service.}\r\n"+
    "Text from program : "+text
    );
}


