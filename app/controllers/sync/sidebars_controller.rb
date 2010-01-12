class Sync::SidebarsController < Sync::ApplicationController

  def index
    @sidebars = Sidebar.find(:all)
    respond_to do |format|
      format.json { render :json => @sidebars.to_json(:only => [:id,:active_position,:config,:staged_position])}
    end
  end

end
