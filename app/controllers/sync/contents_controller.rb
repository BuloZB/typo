class Sync::ContentsController < Sync::BaseController
  include LoginSystem
  before_filter :login_required, :only => [:create]
  #  before_create :create_guid

  def index
    @articles = Content.find(:all, :order => 'published_at desc', :limit => 50)
    @articles.each { |article| article.body = article.html(:body)  }
    respond_to do |format|
      format.json { render :json => @articles.to_json(:only => [:id,:type,:title,:author,:body,:extended,:excerpt,:keywords,:created_at,:updated_at,:user_id,:permalink,:guid,:text_filter_id,:whiteboard,:name,:published,:allow_pings,:allow_comments,:published_at]) }
    end
  end

  def create
    @article = Content.new
    @article.title = params[:title]
    @article.body = params[:body]
    @article.excerpt = params[:excerpt]
    @article.type = "Article"
    @article.state = "withdrawn"
    @article.text_filter_id = params[:text_filter_id]
    @article.user_id = current_user.id
    @article.author = current_user.login
    @article.published_at = @article.created_at = @article.updated_at = params[:published_at]
    @article.published = 0
    @article.allow_pings = params[:allow_pings]
    @article.allow_comments = params[:allow_comments]
    build_body
    build_permalink
    build_guid

    if @article.save
      render :text => "The article has been saved", :status => 200
    else
      render :text => "The article has not been saved. Please try again!", :status => 500
    end
  end

  private

  def build_body
    if @article.body =~ /<!--more-->/
      body = @article.body.split('<!--more-->')
      @article.body = body[0]
      @article.extended = body[1]
    end
  end

  def build_permalink
    if params[:permalink] != nil
      @article.permalink = params[:permalink]
    else
      @article.permalink = @article.stripped_title
    end
  end

  def build_guid
    @article.guid = UUID.random_create.to_s
  end
end