class Sync::CategoriesController < Sync::ApplicationController
  def index
    @categories = Category.find(:all)
    respond_to do |format|
      format.json { render :json => @categories.to_json }
    end
  end
end
