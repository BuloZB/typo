class Sync::ContentsController < Sync::BaseController
  include LoginSystem
  before_filter :login_required, :only => [:create]

  def index
    @articles = Content.find(:all, :order => 'published_at desc', :limit => 50)
    @articles.each { |article| article.body = article.html(:body)  }
    respond_to do |format|
      format.json { render :json => @articles.to_json(:only => [:id,:type,:title,:author,:body,:extended,:excerpt,:keywords,:created_at,:updated_at,:user_id,:permalink,:guid,:text_filter_id,:whiteboard,:name,:published,:allow_pings,:allow_comments,:published_at]) }
    end
  end

  def create
    article = Content.new
    article.title = params[:title]
    article.body = params[:body_and_extended]
    article.type = "Article"
    article.state = "withdrawn"
    article.text_filter_id = 1
    article.user_id
    article.author
    article.save
  end
end