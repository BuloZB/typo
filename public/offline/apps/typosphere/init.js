include.engines();
include.plugins('model','view','controller','dom/fixtures','dom/form_params','model/validation','view/helpers');

include.resources('sqlite_driver','notification');

include(function(){ //runs after prior includes are loaded
  include.models('article','category','tag','sidebar','comment','blog');
  include.controllers('main','article','category','tag','sidebar','link');
  include.views('article','category','tag');
});
