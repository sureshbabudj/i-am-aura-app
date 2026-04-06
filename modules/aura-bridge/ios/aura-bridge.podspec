Pod::Spec.new do |s|
  s.name           = 'aura-bridge'
  s.version        = '1.0.0'
  s.summary        = 'Minimal native bridge for Aura shared storage path retrieval.'
  s.description    = 'Minimal native bridge for Aura shared storage path retrieval.'
  s.author         = 'Aura Developer'
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms       = { :ios => '15.1' }
  s.source         = { :git => '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
  
  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
