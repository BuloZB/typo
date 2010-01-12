class Sync::CategorizationsController < Sync::ApplicationController

  def index
    @categorizations = Categorization.find(:all)
    respond_to do |format|
      format.json { render :json => @categorizations.to_json }
    end
  end

end
