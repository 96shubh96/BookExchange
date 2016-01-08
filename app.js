var mysql=require('mysql');
var express = require('express');
var app = express();
var mailer = require("nodemailer");
var path=require('path');
var ejs = require('ejs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');

var validate = require('form-validate');
var fs = require('fs');
var Busboy = require('busboy');
var busboy = require('connect-busboy');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var info ;
app.use(cookieParser('secret'));
app.use(session({secret: 'pratikwagh', saveUninitialized: true, resave: true}));
app.use(flash());
var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


  
var key=0,book_added=0;
var bookName;
  var info ;
  var name1="";
var firstname="";
var lastname="";
var uploadname="";
   var contacti="", branchi="", emaili="", semi="";

// some middleware

app.use(expressValidator());
app.use(busboy());
app.use('/static',express.static(__dirname + '/public')); 
app.use(express.static(__dirname + '/JS'));
app.use(express.static(__dirname + '/node_modules'));

//for storing current date
var now = new Date();
var jsonDate = now.toJSON();
var then = new Date(jsonDate);
var sess;
// database information
function DB(){
var connection =mysql.createConnection({
     host:'127.0.0.1',
	 user:'root',
	 password:'1996',
	 database:'articles'
});
connection.connect();
return connection;
}

//mail information SMTP
var smtpTransport = mailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "bookexchangesite@gmail.com",
            pass: "bookexchange15"
        }
    });
// sending all html files to server  
/*app.get('/',function(req,res){
  res.sendFile(__dirname+'/homepage.html');
  });*/
  
app.get('/',function(req,res){
sess=req.session;
if((sess.password)&&(sess.email))
{
res.render('profilepage.ejs',{users:name1});
}
else
{
 res.render('homepage.ejs');
}  
});
  
 app.get('/homepage',function(req,res){
   sess=req.session;
   
if((sess.password)&&(sess.email))
{
res.render('profilepage.ejs',{users:name1});
}
else
{
 res.render('homepage.ejs');
}
});

app.get('/profilepage',function(req,res){
sess=req.session;
if((sess.email)&&(sess.password))
{
res.render('profilepage.ejs',{users:name1});
 
}
else
{
res.redirect('/homepage');
}

});

app.get('/signup',function(req,res){
sess=req.session;
if((sess.password)&&(sess.email))
{
res.render('profilepage.ejs',{users:name1});
}
else
{
 res.render('signup.ejs');
}
});

app.get('/login',function(req,res){
sess=req.session;
if((sess.password)&&(sess.email))
{
res.render('profilepage.ejs',{users:name1});
}
else
{
req.flash(info, 'Hi there!');
res.render('login.ejs');
}
  
});


app.get('/addbook',function(req,res){
  res.render('addbook.ejs');
  });

app.get('/contactus',function(req,res){
  res.render('contactus.ejs');
  });
  

  
 app.get('/sor',function(req,res){
  res.render('sor.ejs');
  });
  app.get('/no_book',function(req,res){
  res.render('no_book.ejs');
  });

   app.get('/request',function(req,res){
  res.render('request.ejs');
  });
   // for transferring signup data to database
var uploadname;
//app.get('/signupdata',  routes.signupdata);
app.post('/signupdata', function (req, res) {
    sess = req.session;
    name1 = "";
    // Add these values to your MySQL database here
    var objDB = new DB();
    name1 = name1 + req.body.firstname + " " + req.body.lastname;
    //firstname1=req.body.firstname;
    // lastname1=req.body.lastname;
    //req.check('rollno', 'A valid rollno is required').len(8,8).isInt();   //Validate rollno
    //req.check('firstname', 'A valid first name is required').isString();   //Validate first name
    //req.check('lastname', 'A valid last name is required').isString();
    //req.check('email', 'A valid email is required').isEmail();  //Validate email
    req.assert('rollno', 'rollno is required').notEmpty();
    req.assert('name', 'Password is required').notEmpty();
    req.assert('email', 'Email is required').isEmail();
    //req.assert('message', 'Message is required').notEmpty();

    var errors = req.validationErrors();
    var post = {
        roll_no: req.body.rollno,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        name: name1,
        branch: req.body.branch,
        semester: req.body.sem,
        contact: req.body.contact,
        emailid: req.body.email,
        password: req.body.password,
        record_created: then,
        record_updated: then
    }

    objDB.query('INSERT INTO user_info SET ?', post, function (error, result) {
        if (error) {
            console.log(error.message);
            return res.redirect('/signup');
        }
        else {
            console.log(result);
            key = req.body.rollno;
            req.flash('info', 'User Signed Up Successfully');
            firstname = req.body.firstname;
            lastname = req.body.lastname;
            branchi = req.body.branch;
            contacti = req.body.contact;
            semi = req.body.sem;
            emaili = req.body.email;
            key = req.body.rollno;
            sess.email = req.body.email;
            sess.password = req.body.password;
            return res.render('profilepage.ejs', { users: name1 });
        }

    });


});  

 

//for checking login credentials
  app.post('/logindata', function (req, res) {
      
      var objDB = new DB();
      var email1 = req.body.email;
      console.log(req.body.email);
      var password1 = req.body.password;

      var query = "SELECT firstname,lastname,roll_no,name,branch,contact,semester,emailid, password " +
                         "FROM user_info WHERE emailid = ? and password=?";

      objDB.query(query, [email1, password1], function (error, result) {
          if (error) {
              console.log(error.message);
          }
          else {
              if (result.length === 0) {
                  console.log('incorrect information');
  
                  return res.render('login.ejs');
              }
              else {
                  sess=req.session;
				  console.log('user logged in successfully');
				  firstname=result[0].firstname;
				  lastname=result[0].lastname;
                  name1 = result[0].name;
                  branchi=result[0].branch;
                  contacti= result[0].contact;
                  semi= result[0].semester;
                  emaili= result[0].emailid;
                  key = result[0].roll_no;
				  sess.email=req.body.email;
                     sess.password=req.body.password;
                  req.flash('info', 'User Logged In Successfully');
                  return res.render('profilepage.ejs', { users: name1 });
              }
          }
      });
  });

// search box implementation
       app.get('/profilepage/search', function (req, res) {
           var obj = new DB();
           
           var query = "SELECT bookname " +
                               "FROM book_info WHERE  bookname LIKE ?";
           var name = "%" + req.query.key + "%";
           obj.query(query, [name], function (err, rows, fields) {
               if (err) throw err;
               var data = [];

               for (i = 0; i < rows.length; i++) {
                   data.push(rows[i].bookname);
               }

               res.end(JSON.stringify(data));
           });
          
       });

//adding book details into database
       app.post('/bookdata', function (req, res) {
           var objDB = new DB();
           var check = req.body.name;
           var requestQuery = 'SELECT name,emailid FROM request WHERE bookname=?';

           var text1 = "Hey, The book you had requested for has just been arrived";
           var html = "<b>" + text1 + "</b>";
           console.log(text1);

           objDB.query(requestQuery, [check], function (err, rows, fields) {
               if (err) throw err;
               for (i = 0; i < rows.length; i++) {
                   console.log(rows[i].emailid);
                   var mail = {
                       from: "bookexchangesite@gmail.com",
                       to: rows[i].emailid,
                       subject: "Request!!!!!!",
                       text: text1,
                       html: html
                   }
                   smtpTransport.sendMail(mail, function (error, response) {
                       if (error) {
                           console.log(error);
                       } else {
                           console.log("Message sent: " + response.message);
                       }

                       smtpTransport.close();
                   });
               }

           });
           var post1 = {
               name: name1,
               bookname: req.body.name,
               author: req.body.author,
               edition: req.body.edition,
               exchangetype: req.body.type
           }
           console.log(req.body);
           var post = {

               bookname: req.body.name,
               author: req.body.author,
               edition: req.body.edition
           }
           objDB.query('INSERT INTO relation SET ?', post1, function (error, result) {
               if (error) {
                   console.log(error.message);

               } else {
                   console.log(result);

               }
           });
           objDB.query('INSERT INTO book_info SET ?', post, function (error, result) {
               if (error) {
                   console.log(error.message);
                   return res.redirect('/addbook');
               } else {
                   console.log(result);
                   book_added++;
                   return res.redirect('/profilepage');
               }
           });
       });

app.get('/logout',function(req,res){

req.session.destroy(function(err){
       if(err){
              console.log(err);
                }
            else
                 {
                  res.redirect('/');
                  }
           });
});		
		
//rendering viewprofile.ejs
app.get('/viewprofile', function (req, res) {
sess=req.session;
if((sess.password)&&(sess.email))
{
 var objDB = new DB();
    console.log(key);
    objDB.query('SELECT bookname FROM relation WHERE name = ? ', name1, function (error, result) {
        if (error) {
            console.log(error.message);

        } else {
            console.log(result);
            book_added = result.length;

        }
    });
    res.render('viewprofile.ejs', { name: name1, roll: key, branch: branchi, contact: contacti, email: emaili, sem: semi, booka: book_added });
}
else
{
res.render('homepage.ejs');
}

	});


app.get('/editprofile',function(req,res){
sess=req.session;   
if((sess.password)&&(sess.email))
{
   
   var objDB = new DB();
    console.log(key);
    objDB.query('SELECT bookname FROM relation WHERE name = ? ', name1, function (error, result) {
        if (error) {
            console.log(error.message);

        } else {
            console.log(result);
            book_added = result.length;

        }
    });
	console.log(firstname);
    res.render('editprofile.ejs', { name: firstname, name1:lastname , roll: key, branch: branchi, contact: contacti, email: emaili, sem: semi, booka: book_added });
}
else
{
res.render('homepage.ejs');
}


});
//rendering searchbook.ejs
app.get('/searchbook', function (req, res) {
sess=req.session;
if((sess.password)&&(sess.email))
{

    var objDB = new DB();
    var query = 'SELECT user_info.name,contact,emailid,semester,exchangetype ' +
                           ' FROM relation,user_info WHERE relation.name=user_info.name and user_info.name!=? and bookname=?';

    objDB.query(query, [name1,bookName], function (err, rows, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
            if (rows.length === 0) {
                console.log('incorrect information');
                return res.redirect('/sor');
            }
            else {

                console.log('Search Complete');

                return res.render('searchbook.ejs', { data: rows,book:bookName });


            }
        }
		});
}
else
{
res.render('homepage.ejs');
}

    });


//for sending mail
app.get('/searchbook/request/:email', function (req, res) {

    console.log(req.params.email);
    var mail = req.params.email;
    var text1 = name1 + " has requested " + bookName + " from you";
    var html = "<b>"+text1+"</b>";
    console.log(text1);
    var mail = {
        from: "bookexchangesite@gmail.com",
        to: mail,
        subject: "Request!!!!!!",
        text: text1,
        html:html
    }

    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });

    res.redirect('/searchbook');

});

//for removing book
app.get('/updatebooks/remove/:book', function (req, res) {

    console.log(req.params.book);
    var book = req.params.book;
    var obj = new DB();
    var query = 'DELETE FROM relation WHERE bookname=?';
    var query1= 'DELETE FROM book_info WHERE bookname=?';

    obj.query(query, [book], function (err, rows, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
                console.log("Deleted.from.relation.");
            }
            });
     
      obj.query(query1, [book], function (err, rows, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
                console.log("Deleted.from.book_info.");
            }
            });

    res.redirect('/updatebooks');

});

//contact us page
app.post('/contactus/send', function (req, res) {
    var obj = new DB();
    var text = req.body.fname + ' ' + req.body.lname + ' of ' + req.body.branch + ' ' + req.body.year + ' year wants to contact.';
    var text2 = "Email ID:-" + req.body.email;
    var text3 = "Message:-" + req.body.text;
    console.log(text);
     console.log(text2);
      console.log(text3);
    var html = "<b>" + text + "</b>" + "<br>" + "<b>" + text2 + "</b>" + "</br>" + "<b>" + text3 + "</b>";
    var mail = {
        from: req.body.email,
        to: "bookexchangesite@gmail.com",
        subject: req.body.subject,
        text: text,
        html: html
    }

    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });

    res.redirect('/profilepage');

});

//request handling
app.post('/request/sent', function (req, res) {
    var obj = new DB();
    var post = {

        bookname: req.body.bname,
        name: req.body.uname,
        emailid: req.body.e_mail
    }
    obj.query('INSERT INTO request SET ?', post, function (error, result) {
        if (error) {
            console.log(error.message);

        } else {
            console.log(result);
            res.redirect('/profilepage');
        }
    });
});
//Update profile
app.post('/editdata',function(req,res){

sess=req.session;
      // Add these values to your MySQL database here
      var objDB = new DB();
      //firstname1=req.body.firstname;
	 // lastname1=req.body.lastname;
	//req.check('rollno', 'A valid rollno is required').len(8,8).isInt();   //Validate rollno
	//req.check('firstname', 'A valid first name is required').isString();   //Validate first name
	//req.check('lastname', 'A valid last name is required').isString();
    //req.check('email', 'A valid email is required').isEmail();  //Validate email
  req.assert('rollno', 'rollno is required').notEmpty();
  req.assert('name', 'Password is required').notEmpty();
  req.assert('email', 'Email is required').isEmail();  
  //req.assert('message', 'Message is required').notEmpty();

 
contacti=req.body.contact;
emaili=req.body.email;
branchi=req.body.branch;
//semi=req.body.sem;
console.log(req.body.sem);
if((req.body.sem)===undefined)
{
semi=semi;
}
else
{
semi=req.body.sem;
}
if((req.body.branch)===undefined)
{
branchi=branchi;
}
else
{
branchi=req.body.branch;
}
if((req.body.contact)===undefined)
{
contacti=contacti;
}
else
{
contacti=req.body.contact;
}
if((req.body.email)===undefined)
{
emaili=emaili;
}
else
{
emaili=req.body.email;
}
var roll_no=key;
console.log(req.body.contact);
  var errors = req.validationErrors();
  var post = {
          roll_no: key,
          firstname: firstname,
          lastname:lastname,
		  name:name1,
		  branch: branchi,
          semester: semi,
          contact: contacti,
          emailid: emaili,
          password: req.body.password,
		  record_created: then,
          record_updated: then
      } 
      objDB.query('UPDATE user_info SET ? where roll_no = ?', [post,roll_no], function (error, result) {
          if (error) {
              console.log(error.message);
              return res.redirect('/editprofile');
          } 
		  else {
              console.log(result);
              //key = req.body.rollno;
              //req.flash('info', 'User Signed Up Successfully');
              //firstname=firstname;
			 // lastname=lastname;
             // branchi = branchi;
              //contacti = result[0].contact;
              //semi = result[0].sem;
              //emaili = result[0].email;
              //key = key;
              sess.email=req.body.email;
              sess.password=req.body.password;
              //res.redirect('/viewprofile');
			  return res.render('profilepage.ejs', { users: name1 });
          }



});
});
app.get('/updatebooks',function(req,res){
sess=req.session;
if((sess.password)&&(sess.email))
{

    var objDB = new DB();
    var query = 'SELECT bookname,author,edition,exchangetype' +
                           ' FROM relation  WHERE name=?';

    objDB.query(query, [name1], function (err, rows, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
            if (rows.length === 0) {
                console.log('incorrect information');
                return res.redirect('/no_book');
            }
            else {

                console.log('Search Complete');

                return res.render('updatebooks.ejs', { data: rows });


            }
        }
		});
}
else
{
res.render('homepage.ejs');
}

});
//accessing clients variable
	    io.on('connection', function (socket) {
	        socket.on('news', function (data) {
	            console.log(data.msg);
	             bookName = data.msg;
	        });
	    });

// listen at port 1337
server.listen(1337);

//confirmation
console.log("Running at Port 1337");