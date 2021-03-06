class Sync::FeedbackController < Sync::BaseController

  def index
    @feedback = Feedback.find(:all, :conditions => "published=1")
    @feedback.each { |comment| comment.body = comment.html  }
    respond_to do |format|
      format.json { render :json => @feedback.to_json(:only => [:id,:type,:title,:author,:body,:excerpt,:created_at,:updated_at,:user_id,:guid,:text_filter_id,:whiteboard,:article_id,:email,:url,:ip,:blog_name,:published,:published_at,:state_confirmed]) }
    end
  end

  def create
    @comment = Comment.new
    @comment.author = params[:author]
    @comment.body = params[:body]
    @comment.email = params[:email]
    @comment.url = params[:url]
    @comment.article_id = params[:article_id]
    
    if @comment.save
      render :text => "The feedback has been saved", :status => 200
    else
      render :text => "The feedback has not been saved. Please try again!", :status => 500
    end
  end

end
