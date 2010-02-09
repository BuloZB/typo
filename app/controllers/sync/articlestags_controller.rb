class Sync::ArticlestagsController < Sync::BaseController

  def index
    @articles_tags = Content.find_by_sql('SELECT * FROM articles_tags')
    respond_to do |format|
      format.json { render :json => @articles_tags.to_json }
    end
  end

end
