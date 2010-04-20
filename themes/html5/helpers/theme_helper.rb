# Adds support for HTML5 input fields
def input_field(object_name, method, options = {})
  options[:type] ||= "text"
  ActionView::Helpers::InstanceTag.new(object_name, method, self, options.delete(:object)).to_input_field_tag(options[:type], options)
end

def display_comments_counter(article)
  pluralize(article.published_comments.size,
    _('%d comments', article.published_comments.size),
    _('%d comment', article.published_comments.size),
    _('%d comments', article.published_comments.size))
end

def display_article_time(time)
  time.strftime('%d. %m. %Y %H:%M').to_s
end

def display_gregorian_time(time)
  time.strftime('%Y-%m-%dT%H:%M').to_s
end

def mark_search_expr(text,query)
  text.gsub(/#{query}|#{query.downcase}|#{query.upcase}|#{query.capitalize}/,"<mark>#{query}</mark>")
end