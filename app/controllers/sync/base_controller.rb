class Sync::BaseController < ActionController::Base
  before_filter :add_permissions

  def add_permissions
    AccessControl.map :require => [ :admin ]  do |map|
      map.permission "sync/contents"
    end
  end
end
