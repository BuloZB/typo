class ManifestController < ApplicationController
    before_filter :set_default_content_type

  def set_content_type(content_type)
    headers["Content-Type"] = content_type
  end

  def set_default_content_type
    set_content_type("text/cache-manifest")
  end

  def index
  end
end
