require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'widget-bridge'
  s.version        = package['version']
  s.summary        = 'Native bridge for widget synchronization'
  s.description    = 'Native bridge for widget synchronization'
  s.license        = 'MIT'
  s.author         = 'Aura'
  s.homepage       = 'https://github.com/expo/expo'
  s.platforms      = { :ios => '15.1' }
  s.source         = { :git => '' }
  s.static_framework = false

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "ios/**/*.{h,m,swift}"
end
