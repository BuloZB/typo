class Sync::ContentsController < Sync::BaseController

  def index
    @articles = Content.find(:all, :limit => 20)
    @articles.each { |article| article.body = article.html(:body)  }
    respond_to do |format|
      format.json { render :json => @articles.to_json(:only => [:id,:type,:title,:author,:body,:extended,:excerpt,:keywords,:created_at,:updated_at,:user_id,:permalink,:guid,:text_filter_id,:whiteboard,:name,:published,:allow_pings,:allow_comments,:published_at]) }
    end
  end
end