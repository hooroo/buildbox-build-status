const request = require('request');
const express = require('express');

const app     = express();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);
const jsdom   = require("jsdom-nogyp").jsdom;
const utils   = require("./utils");
const sass    = require("node-sass");
const fs      = require('fs');

const settings = ( require('./config.json') );

const port = 5001;

app.use(express.static(__dirname + '/../public'));

pollUrl = 'https://cc.buildkite.com/' + settings.project + '.xml?access_token=' + settings.accessToken + '&branch='+settings.branch;

processXMLResponse = function(xml) {
  const doc = jsdom(xml);
  let projects = doc.getElementsByTagName('Project');
  const whitelisted = settings.whitelist;
  projects = Boolean(whitelisted.length) ? applyWhitelist(projects, whitelisted) : projects;

  const statuses = [];

  for(const i = 0; i < projects.length; i++) {
    const project = projects[i];
    const projectName           = project.getAttribute('name');
    const projectActivity       = project.getAttribute('activity').toLowerCase();
    const projectPriorStatus    = getPriorStatus(project);
    const projectCurrentStatus  = getCurrentStatus(projectPriorStatus, projectActivity);

    status = {
      name:                 utils.humanize(projectName),
      identifier:           utils.dasherize(projectName),
      priorStatus:          utils.humanize(projectPriorStatus),
      dashedPriorStatus:    utils.dasherize(projectPriorStatus),
      status:               utils.humanize(projectCurrentStatus),
      dashedStatus:         utils.dasherize(projectCurrentStatus),
      timeStamp:            utils.friendlyDate(project.getAttribute('lastbuildtime')),
      buildNumber:          getBuildNumber(project)
    }
    statuses.push(status);
  }
  return statuses;
}

applyWhitelist = function(projects, whitelistedProjects) {
  newProjects = []
  whiteListedProjectsWithBranch = []

  for(project in whitelistedProjects){
    whiteListedProjectsWithBranch.push(whitelistedProjects[project] + '-' + settings.branch)
  }
  for(var i = 0; i < projects.length; i++) {
    if( whiteListedProjectsWithBranch.indexOf( utils.dasherize(projects[i].getAttribute('name')) ) >= 0 ) {
      newProjects.push( projects[i] );
    }
  }
  return newProjects;
}

getBuildNumber = function(project) {
  const buildLabel = project.getAttribute('lastbuildlabel');
  if(buildLabel == undefined)
    buildLabel = "";
  else
    buildLabel = "#" + buildLabel;
  return buildLabel;
}

getCurrentStatus = function(priorStatus, activity) {
  if(activity == "building") {
    return activity;
  }
  return priorStatus;
}

getPriorStatus = function(project) {
  if (!project.getAttribute('lastbuildstatus')) {
    return 'inactive';
  }
  return project.getAttribute('lastbuildstatus').toLowerCase();
}

io.on('connection', function (socket) {

  request.get(pollUrl, function (error, response, body) {
    status = processXMLResponse(body);
    socket.emit('build_status', status);
  });

  // Poll for build status
  setInterval(function() {
    request.get(pollUrl, function (error, response, body) {
      status = processXMLResponse(body);
      socket.emit('build_status', status);
    });
  }, settings.pollInterval);
});

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
