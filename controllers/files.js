var ACS = require('acs').ACS,
    logger = require('acs').logger;

function _index(req, res) {
  req.session.controller = "files";
  ACS.Files.query({per_page:1000, order:"-updated_at", where:"{\"user_id\":\""+req.session.user.id+"\"}"}, function(e) {
    if(e.success && e.success === true){
      res.render('files/index', {
        layout: 'layout/application',
        obj: e,
        req: req
      });
    }else{
      req.session.msg = e.message;
      res.redirect('/');
      logger.debug('Error: ' + JSON.stringify(e));
    }
  }, req, res);
}

function _show(req, res) {
  req.session.controller = "files";
  var data = {
    file_id: req.params.id
  };
  ACS.Files.show(data, function(e) {
    if(e.success && e.success === true){
      res.render('files/show', {
        layout: 'layout/application',
        req: req,
        obj: e
      });
    }else{
      req.session.msg = e.message;
      res.redirect('/files');
      logger.debug('Error: ' + JSON.stringify(e));
    }
  }, req, res);
}

function _new(req, res) {
  req.session.controller = "files";
  res.render('files/new', {
    req: req,
    layout: 'layout/application'
  });
}

function _create(req, res) {
  req.session.controller = "files";
  var data = {
    name: req.body.name,
    file: req.files.file,
    tags: req.body.tags,
    session_id: req.session.user.session_id
  };
  ACS.Files.create(data, function(e) {
    if(e.success && e.success === true){
      logger.info('files#create: ' + JSON.stringify(e));
      req.session.msg = "Successfully create a file #"+e.files[0].id;
      res.redirect('/files');
    }else{
      logger.debug('Error: ' + JSON.stringify(e));
      req.session.msg = e.message;
      res.redirect('/files/new');
    }
  }, req, res);
}

function _edit(req, res) {
  req.session.controller = "files";
  var data = {
    file_id: req.params.id
  };
  ACS.Files.show(data, function(e) {
    if(e.success && e.success === true){
      res.render('files/edit', {
        layout: 'layout/application',
        req: req,
        obj: e
      });
    }else{
      logger.debug('Error: ' + JSON.stringify(e));
      req.session.msg = e.message;
      res.redirect('/files');
    }
  }, req, res);
}

function _update(req, res) {
  req.session.controller = "files";
  if(req.files.file.name !== ""){
    var data = {
      file_id: req.params.id,
      name: req.body.name,
      file: req.files.file,
      tags: req.body.tags,
      session_id: req.session.user.session_id
    };
  }else{
    var data = {
      file_id: req.params.id,
      name: req.body.name,
      tags: req.body.tags,
      session_id: req.session.user.session_id
    };
  }
  ACS.Files.update(data, function(e) {
    if(e.success && e.success === true){
      logger.info('files#update: ' + JSON.stringify(e));
      req.session.msg = "Successfully update a file #"+e.files[0].id;
      res.redirect('/files');
    }else{
      logger.debug('Error: ' + JSON.stringify(e));
      req.session.msg = e.message;
      res.redirect('/files/'+req.params.id+'/edit');
    }
  }, req, res);
}

function _destroy(req, res) {
  req.session.controller = "files";
  var data = {
    file_id: req.params.id,
    session_id: req.session.user.session_id
  };
  ACS.Files.remove(data, function(e) {
    if(e.success && e.success === true){
      logger.info('files#destroy: ' + JSON.stringify(e));
      req.session.msg = "Successfully delete a file #"+req.params.id;
      res.redirect('/files');
    }else{
      logger.debug('Error: ' + JSON.stringify(e));
      req.session.msg = e.message;
      res.redirect('/files');
    }
  }, req, res);
}