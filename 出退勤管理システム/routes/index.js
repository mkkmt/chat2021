var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// === 出退勤入力関連 ================================================================

// 出退勤入力画面（初期表示）
router.get('/addattend', function(req, res) {
  var db = req.db;
  var collection = db.get('employee');
  collection.find({'status':''},{}, function(e, docs) {
    //res.send(docs);
    res.render('addattend', {"employee": docs});
  });
})

// 出退勤入力画面（初期登録）
router.post('/addattend', function(req, res) {
  var db = req.db;
  var collection = db.get('attendance');
  var userinfo = req.body.name.split(',');
  collection.find({name:userinfo[0], date:req.body.date},{}, function(e, docs) {
    //console.log(docs);
    if(docs.length==0) {
      var data = {
        'name': userinfo[0],
        'date': req.body.date,
        'start': req.body.start,
        'end': req.body.end,
        'wage': userinfo[1],
        'message': '',
        'status': '未承認'
      };
      collection.insert(data, function(err, result) {
        if (err) {
          res.send('There was a problem adding the information to the database.');
        } else {
          res.send('success');
        }
      });    
    } else {
      res.send('同一の名前、日付で出退勤の登録があります！');
    }
  });
});

// 出退勤入力確認画面（表示）
router.get('/attendlist', function(req, res) {
  var db = req.db;
  var collection = db.get('employee');
  collection.find({},{}, function(e, docs) {
    //res.send(docs);
    res.render('attendlist', {"employee": docs});
  });
});

// 出退勤入力確認画面で入力した名前＋年月で合致する勤怠入力情報を返す
router.post('/attendlist', function(req, res) {
  var date = req.body.year+'-'+req.body.month;
  console.log('name:'+req.body.name+', date:'+date);
  var db = req.db;
  var collection = db.get('attendance');
  collection.find({$and:[{name:req.body.name},{date:{$regex:date}}]},{}, function(e, docs) {
    console.log(e);
    res.send(docs);
  });
});

// 出退勤入力確認の検索結果のうち、削除ボタンが押された該当の勤怠入力情報を削除する
router.get('/deleteattend/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('attendance');
  collection.remove({'_id': req.params.id}, function(err) {
    if (err) {
      res.send('There was a problem deleting the information to the database.');
    } else {
      res.send('success');
    }
  });
});

// 出退勤入力確認の検索結果のうち、変更ボタンが押された該当の勤怠入力情報の編集（勤怠変更）画面を返す
router.get('/updateattend/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('attendance');
  collection.find({'_id': req.params.id},{}, function(e, docs) {
    res.render('updateattend', {"updateattend": docs});
  });
});

// 勤怠変更画面で入力（変更）された内容を反映する
router.post('/updateattend', function(req, res) {
  var db = req.db;
  var collection = db.get('attendance');
  var data = {
    'date': req.body.date,
    'start': req.body.start,
    'end': req.body.end,
    'status': '未承認'
  };
  collection.update({'_id': req.body.id},{$set: data}, function(err) {
    if (err) {
      res.send('There was a problem updating the information to the database.');
    } else {
      var collection = db.get('employee');
      collection.find({'status':''},{}, function(e, docs) {
        res.render('attendlist', {"employee": docs});
      });    
    }
  });
});

// === 出退勤承認関連 ================================================================

// 出退勤承認画面（未承認一覧を表示）
router.get('/checkattend', function(req, res) {
  var db = req.db;
  var collection = db.get('attendance');
  collection.find({'status':'未承認'},{}, function(e, docs) {
    res.render('checkattend', {"attendlist": docs});
  });
});

// 出退勤承認画面に表示した未承認一覧のうち、該当の項目について承認/否認状況を反映させる
router.post('/checkattend', function(req, res) {
  var db = req.db;
  var collection = db.get('attendance');
  var data = {
    'status': req.body.status,
    'message': req.body.message
  };
  collection.update({'_id': req.body.id},{$set: data}, function(err) {
    if (err) {
      res.send('There was a problem updating the information to the database.');
    } else {
      res.send('Success');
    }
  });
});

// === 社員情報関連 =================================================================

// 社員情報入力画面（初期表示）
router.get('/addemployee', function(req, res) {
  res.render('addemployee');
})

// 社員情報入力画面（初期登録）
router.post('/addemployee', function(req, res) {
  var db = req.db;
  var collection = db.get('employee');
  var data = {
    'name': req.body.name,
    'wage': req.body.wage,
    'status': ''
  };
  collection.insert(data, function(err, result) {
    if (err) {
      res.send('There was a problem adding the information to the database.');
    } else {
      res.render('index');
    }
  });
});

// 社員情報一覧画面（社員一覧を表示）
router.get('/employeelist', function(req, res) {
  var db = req.db;
  var collection = db.get('employee');
  collection.find({'status':''},{}, function(e, docs) {
    //res.send(docs);
    res.render('employeelist', {"employeelist": docs});
  });
});

// 社員一覧のうち、削除ボタンが押された社員を削除する
router.get('/deleteemployee/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('employee');
  var data = {
    'status': 'delete'
  };
  collection.update({'_id': req.params.id},{$set: data}, function(err) {
  //collection.remove({'_id': req.params.id}, function(err) {
    if (err) {
      return res.send('There was a problem updating the information to the database.');
    } else {
      var collection = db.get('employee');
      collection.find({'status':''},{}, function(e, docs) {
        res.render('employeelist', {"employeelist": docs});
      });    
    }
  });
});

// 社員一覧のうち、変更ボタンが押された社員の情報の編集（社員情報変更）画面を返す
router.get('/updateemployee/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('employee');
  collection.find({'_id': req.params.id},{}, function(e, docs) {
    res.render('updateemployee', {"updateemployee": docs});
  });
});

// 社員情報変更画面で入力（変更）された内容を反映する
router.post('/updateemployee', function(req, res) {
  var db = req.db;
  var collection = db.get('employee');
  var data = {
    'name': req.body.name,
    'wage': req.body.wage
  };
  collection.update({'_id': req.body.id},{$set: data}, function(err) {
    if (err) {
      return res.send('There was a problem updating the information to the database.');
    } else {
      var collection = db.get('employee');
      collection.find({'status':''},{}, function(e, docs) {
        res.render('employeelist', {"employeelist": docs});
      });    
    }
  });
});

// 支払い状況画面（名前＋年月毎の支払い状況を表示）
router.get('/report', function(req, res) {
  var db = req.db;
  var attcollection = db.get('attendance');
  attcollection.find({},{}, function(e, attdocs) {
    //res.send(docs);
    res.render('report', {"attendlist": attdocs});
    //var empcollection = db.get('employee');
    //empcollection.find({},{}, function(e, empdocs) {
    //  res.render('report', {"attendlist": attdocs, "employee": empdocs});
    //});
  });
});

module.exports = router;
