# Adds support for HTML5 input fields
def input_field(object_name, method, options = {})
  options[:type] ||= "text"
  ActionView::Helpers::InstanceTag.new(object_name, method, self, options.delete(:object)).to_input_field_tag(options[:type], options)
end